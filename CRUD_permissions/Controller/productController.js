const fs = require("fs");
const path = require("path");
const Product = require('../Models/Product');
const csvParser = require('csv-parser');  
const xlsx = require('xlsx'); 
const { sendSuccess, sendError } = require('../utils/responseFormatter');

class productController {
  // GET all products with pagination
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
      // Ensure at least one file (image or document) uploaded
      const hasImages = req.files && req.files.images && req.files.images.length > 0;
      const hasDocuments = req.files && req.files.documents && req.files.documents.length > 0;

      if (!hasImages && !hasDocuments) {
        return sendError(res, "At least one image or document file is required.", 400);
      }

      // Map uploaded images paths (with /uploads/images/ folder)
      let imagePaths = [];
      if (hasImages) {
        imagePaths = req.files.images.map(file => `/uploads/images/${file.filename}`);
      }

      // Map uploaded documents paths (with /uploads/documents/ folder)
      let documentPaths = [];
      if (hasDocuments) {
        documentPaths = req.files.documents.map(file => `/uploads/documents/${file.filename}`);
      }

      const newProduct = new Product({
        ...req.body,
        images: imagePaths,
        documents: documentPaths,
      });

      const savedProduct = await newProduct.save();
      sendSuccess(res, "Product added successfully", savedProduct);

    } catch (err) {
      sendError(res, "Error adding product", 500, err.message);
    }
  }

  // UPDATE product
  async updateProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return sendError(res, "Product not found", 404);
      }

      // Start with current images and documents arrays
      let updatedImages = [...product.images];
      let updatedDocuments = [...product.documents];

      // Parse and delete images if specified
      if (req.body.imagesToDelete) {
        let imagesToDelete = req.body.imagesToDelete;

        if (typeof imagesToDelete === 'string') {
          try {
            imagesToDelete = JSON.parse(imagesToDelete);
          } catch (err) {
            return sendError(res, "Invalid format for imagesToDelete", 400);
          }
        }

        if (!Array.isArray(imagesToDelete)) {
          return sendError(res, "imagesToDelete must be an array", 400);
        }

        imagesToDelete.forEach(imgName => {
          updatedImages = updatedImages.filter(img => path.basename(img) !== imgName);
          const fullPath = path.join(__dirname, "..", "uploads", "images", imgName);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }

      // Parse and delete documents if specified
      if (req.body.documentsToDelete) {
        let documentsToDelete = req.body.documentsToDelete;

        if (typeof documentsToDelete === 'string') {
          try {
            documentsToDelete = JSON.parse(documentsToDelete);
          } catch (err) {
            return sendError(res, "Invalid format for documentsToDelete", 400);
          }
        }

        if (!Array.isArray(documentsToDelete)) {
          return sendError(res, "documentsToDelete must be an array", 400);
        }

        documentsToDelete.forEach(docName => {
          updatedDocuments = updatedDocuments.filter(doc => path.basename(doc) !== docName);
          const fullPath = path.join(__dirname, "..", "uploads", "documents", docName);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }

      // Add newly uploaded images (ensure correct folder in URL)
      if (req.files && req.files.images && req.files.images.length > 0) {
        const newImagePaths = req.files.images.map(file => `/uploads/images/${file.filename}`);
        updatedImages.push(...newImagePaths);
      }

      // Add newly uploaded documents (ensure correct folder in URL)
      if (req.files && req.files.documents && req.files.documents.length > 0) {
        const newDocumentPaths = req.files.documents.map(file => `/uploads/documents/${file.filename}`);
        updatedDocuments.push(...newDocumentPaths);
      }

      // Update product with new data & files
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          images: updatedImages,
          documents: updatedDocuments,
        },
        { new: true }
      );

      sendSuccess(res, "Product updated successfully", updatedProduct);

    } catch (err) {
      sendError(res, "Error updating product", 500, err.message);
    }
  }

  // DELETE product and associated files
  async deleteProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return sendError(res, "Product not found", 404);
      }

      // Delete all associated images files from disk
      product.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, "..", "uploads", "images", path.basename(imagePath));
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });

      // Delete all associated documents files from disk
      product.documents.forEach(docPath => {
        const fullPath = path.join(__dirname, "..", "uploads", "documents", path.basename(docPath));
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });

      // Delete product record from database
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      sendSuccess(res, "Product deleted successfully", deletedProduct);

    } catch (err) {
      sendError(res, "Error deleting product", 500, err.message);
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

      const imagePath = product.images.find(img => path.basename(img) === imageName);
      if (!imagePath) {
        return sendError(res, "Image not found for this product", 404);
      }

      // Remove image from product images array & save
      product.images = product.images.filter(img => img !== imagePath);
      await product.save();

      // Delete file from disk
      const fullPath = path.join(__dirname, "..", "uploads", "images", imageName);
      if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }

      sendSuccess(res, "Image deleted successfully", product);
    } catch (err) {
      sendError(res, "Error deleting product image", 500, err.message);
    }
  }

  // DELETE a single product document
  async deleteProductDocument(req, res) {
    try {
      const { id, documentName } = req.params;

      const product = await Product.findById(id);
      if (!product) {
        return sendError(res, "Product not found", 404);
      }

      const documentPath = product.documents.find(doc => path.basename(doc) === documentName);
      if (!documentPath) {
        return sendError(res, "Document not found for this product", 404);
      }

      // Remove document from product documents array & save
      product.documents = product.documents.filter(doc => doc !== documentPath);
      await product.save();

      // Delete file from disk
      const fullPath = path.join(__dirname, "..", "uploads", "documents", documentName);
      if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }

      sendSuccess(res, "Document deleted successfully", product);
    } catch (err) {
      sendError(res, "Error deleting product document", 500, err.message);
    }
  }
async bulkUpload(req, res) {
  if (!req.file) {
    return sendError(res, "No file uploaded", 400);
  }

  const filePath = path.resolve(req.file.path);
  const ext = path.extname(req.file.originalname).toLowerCase();

  try {
    let records = [];

    if (ext === '.csv') {
      // Parse CSV file
      records = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (error) => reject(error));
      });
    } else if (ext === '.xls' || ext === '.xlsx') {
      // Parse XLS/XLSX file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      records = xlsx.utils.sheet_to_json(sheet);
    } else {
      return sendError(res, "Unsupported file Type", 400);
    }

    // Delete temp upload file after reading
    fs.unlinkSync(filePath);

    // Required fields to check
    const requiredFields = ['name', 'price', 'category', 'stock'];

    // Check missing required fields in first record
    const missingFields = requiredFields.filter(f => !Object.keys(records[0] || {}).includes(f));
    if (missingFields.length > 0) {
      return sendError(res, "Missing required fields", 400, missingFields.join(", "));
    }

    // All valid fields your Product model accepts
    const validFields = ['name', 'price', 'category', 'stock', 'description', 'images', 'documents'];
    // Add more fields here as per your Product model

    let addedCount = 0;
    let repeatedCount = 0;

    for (const record of records) {
      // Skip records missing any required field or with empty required fields
      if (requiredFields.some(f => !record[f])) continue;

      // Check if product exists by name (adjust to your unique key if needed)
      const existing = await Product.findOne({ name: record.name });
      if (existing) {
        repeatedCount++;
        continue;
      }

      // Build product data dynamically from valid fields present in record
      const productData = {};
      validFields.forEach(field => {
        if (record[field] !== undefined) {
          if (field === 'price') productData[field] = parseFloat(record[field]);
          else if (field === 'stock') productData[field] = parseInt(record[field]);
          else productData[field] = record[field];
        }
      });

      const newProduct = new Product(productData);
      await newProduct.save();
      addedCount++;
    }

    return sendSuccess(res, "Bulk upload complete", {
      totalRecords: records.length,
      added: addedCount,
      repeated: repeatedCount,
    });

  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return sendError(res, error.message, 500);
  }
}

  
}


module.exports = new productController();
