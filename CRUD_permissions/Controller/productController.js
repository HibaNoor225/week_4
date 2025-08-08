const Product= require('../models/Product');
const { sendSuccess,sendError } = require('../utils/responseFormatter');

class productController {
  // GET all products
  async getAllProducts(req, res, next) {
    try {
      const products = await Product.find();
      
      sendSuccess(res,"Products get successfully",products)
    } catch (err) {
      next(err);
      sendError(res,"Error getting products",500,err.message)
    }
  }

  // add product
  async addProduct(req, res, next) {
    try {
      const newProduct = new Product(req.body);
      const savedProduct= await newProduct.save();
      sendSuccess(res,"Products addedd successfully",savedProduct)
    } catch (err) {
      sendError(res,"Error Adding products",500,err.message)
    }
  }
//update Product

  async updateProduct(req, res, next) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id,req.body,{ new: true } );

      if (updatedProduct ) {
          sendSuccess(res,"Products updated successfully",updatedProduct)

      } else {
        sendError(res,"Product not found",404,err.message)
        
      }
    } catch (err) {
      sendError(res,"Error Updating Product ",500,err.message)
    }
  }

  // DELETE Product
 async deleteProduct(req, res, next) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    console.log(deletedProduct)
    
    if (deletedProduct) {
      sendSuccess(res, "Product deleted successfully", deletedProduct);
    } else {
      sendError(res, "Product not found", 404);
    }
  } catch (err) {
    console.error("Delete Product Error:", err);
    sendError(res, "Error Deleting Product", 500, err.message || err);
  }
}

}

module.exports = new productController();
