const fs = require("fs");
const path = require("path");
const Product = require('../models/Product');
const { sendSuccess, sendError } = require('../utils/responseFormatter');

class productController {
  // GET all products
  async getAllProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const products = await Product.find()
        .skip(skip)
        .limit(limit);

      const totalProducts = await Product.countDocuments();

      sendSuccess(res, "Products fetched successfully", {
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        products
      });

    } catch (err) {
      sendError(res, "Error fetching products", 500, err.message);
    }
  }

  // ADD product
  async addProduct(req, res) {
    try {
      let imagePaths = [];
      if (req.files && req.files.length > 0) {
        imagePaths = req.files.map(file => `/uploads/${file.filename}`);
      }

      const newProduct = new Product({
        ...req.body,
        images: imagePaths
      });

      const savedProduct = await newProduct.save();
      sendSuccess(res, "Product added successfully", savedProduct);
    } catch (err) {
      sendError(res, "Error adding product", 500, err.message);
    }
  }

 async updateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return sendError(res, "Product not found", 404);
    }

    // 1️⃣ Start with existing images
    let updatedImages = [...product.images];

    // 2️⃣ Delete selected images (if provided)
    if (req.body.imagesToDelete) {
      let imagesToDelete;
      try {
        // Parse if sent as JSON string in Postman
        imagesToDelete = JSON.parse(req.body.imagesToDelete);
      } catch {
        imagesToDelete = req.body.imagesToDelete; // already array
      }

      if (Array.isArray(imagesToDelete)) {
        imagesToDelete.forEach((imgName) => {
          // Remove from DB image array
          updatedImages = updatedImages.filter(
            (img) => path.basename(img) !== imgName
          );

          // Delete from filesystem
          const fullPath = path.join(__dirname, "..", "uploads", imgName);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }
    }

    // 3️⃣ Add newly uploaded images
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map(
        (file) => `/uploads/${file.filename}`
      );
      updatedImages = [...updatedImages, ...newImagePaths];
    }

    // 4️⃣ Update other fields & images array
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: updatedImages },
      { new: true }
    );

    sendSuccess(res, "Product updated successfully", updatedProduct);
  } catch (err) {
    sendError(res, "Error updating product", 500, err.message);
  }
}
//delete product 
  async deleteProduct(req, res) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);

      if (deletedProduct) {
        sendSuccess(res, "Product deleted successfully", deletedProduct);
      } else {
        sendError(res, "Product not found", 404);
      }
    } catch (err) {
      sendError(res, "Error Deleting Product", 500, err.message);
    }
  }

  // DELETE a single product image
  async deleteProductImage(req, res) {
  try {
    const { id, imageName } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return sendError(res, "Product not found", 404);
    }

    console.log("Stored images:", product.images);
    // Match image regardless of whether extension or full path is given
    const imagePath = product.images.find(img =>
      path.basename(img) === imageName ||       // Exact match
      path.basename(img) === `${imageName}.jpg` || // Without extension in req
      path.basename(img) === `${imageName}.png` ||
      path.basename(img) === `${imageName}.jpeg` ||
      path.basename(img).includes(imageName) // Fuzzy match
    );

    if (!imagePath) {
      return sendError(res, "Image not found for this product", 404);
    }

    // Remove image from product array
    product.images = product.images.filter(img => img !== imagePath);
    await product.save();

    // Delete file from uploads folder
    const fullPath = path.join(__dirname, "..", imagePath);
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });

    sendSuccess(res, "Image deleted successfully", product);
  } catch (err) {
    sendError(res, "Error deleting product image", 500, err.message);
  }
}
}

module.exports = new productController();
