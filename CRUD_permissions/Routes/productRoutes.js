const express = require('express');
const router = express.Router();
const productController = require('../Controller/productController');
const  verifyToken  = require('../middleware/authMiddleware');
const checkPermission  = require('../middleware/roleMiddleware.js');
const upload = require("../middleware/uploadImages");

router.post(
  "/",verifyToken,checkPermission("add_products"),upload.any(), productController.addProduct);


//Get all products
router.get('/', verifyToken,checkPermission('view_products'), productController.getAllProducts);
//?page=2&limit=5 for pagination

//  Update product
router.put('/:id', verifyToken,checkPermission('update_products'),upload.any(),  productController.updateProduct);

// Delete product
router.delete('/:id',verifyToken, checkPermission('delete_products'), productController.deleteProduct);
//delete images
router.delete(
  '/:id/image/:imageName',
  verifyToken,
  checkPermission('update_products'),
  productController.deleteProductImage
);

module.exports = router;
