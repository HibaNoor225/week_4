const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

class ImageUploader {
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  });

  fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) cb(null, true);
    else cb(new Error("Only .jpeg, .jpg, .png files allowed"));
  };

  upload = multer({
    storage: this.storage,
    fileFilter: this.fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  });

  // multer middleware to accept any files
 uploadImages = this.upload.fields([{ name: "images", maxCount: 10 }]);

  // Middleware to validate image dimensions (for optional images)
  validateImageDimensions = async (req, res, next) => {
    if (!req.files || req.files.length === 0) return next();

    const maxWidth = 1024;
    const maxHeight = 768;

    try {
      for (const file of req.files) {
        const metadata = await sharp(file.path).metadata();

        if (metadata.width > maxWidth || metadata.height > maxHeight) {
          // Delete invalid file safely
          try {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          } catch (e) {
            console.error("Error deleting file:", e);
          }

          return res.status(400).json({
            error: `Image ${file.originalname} exceeds max allowed dimensions ${maxWidth}x${maxHeight}px.`,
          });
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };

  // Combined middleware: upload + validate (for required images)
  uploadAndValidate = (req, res, next) => {
    this.upload.any()(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "At least one image file is required." });
      }

      const maxWidth = 1024;
      const maxHeight = 768;

      try {
        for (const file of req.files) {
          const metadata = await sharp(file.path).metadata();

          if (metadata.width > maxWidth || metadata.height > maxHeight) {
            // Delete all uploaded files safely
            req.files.forEach(f => {
              try {
                if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
              } catch (e) {
                console.error("Error deleting file:", e);
              }
            });

            return res.status(400).json({
              error: `Image ${file.originalname} exceeds max allowed dimensions ${maxWidth}x${maxHeight}px.`,
            });
          }
        }
        next();
      } catch (error) {
        next(error);
      }
    });
  };
}

module.exports = new ImageUploader();
