// middleware/uploadDocuments.js
const multer = require("multer");
const path = require("path");

class DocumentUploader {
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/documents/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  });

  fileFilter = (req, file, cb) => {
    const allowedTypes = /\.(doc|docx|xls|xlsx|csv|pdf)$/i;
    const allowedMimeTypes = [
      "application/msword", // doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
      "application/vnd.ms-excel", // xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
      "text/csv", // csv
      "application/pdf", // pdf
    ];

    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.includes(file.mimetype);

    if (extname && mimetype) cb(null, true);
    else cb(new Error("Only document files (.doc, .docx, .xls, .xlsx, .csv, .pdf) are allowed"));
  };

  upload = multer({
    storage: this.storage,
    fileFilter: this.fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max size per file
  });

  // Middleware to accept multiple files (any field)
 uploadDocuments = this.upload.fields([{ name: 'documents', maxCount: 10 }]);
}

module.exports = new DocumentUploader();
