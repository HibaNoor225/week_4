const express = require('express');
const router = express.Router();
const productController = require('../Controller/productController');
const  verifyToken  = require('../middleware/authMiddleware');
const checkPermission  = require('../middleware/roleMiddleware.js');

const combinedUploader=require("../middleware/uploadFiles.js")
const uploadBulk = require('../middleware/uploadBulk');

const productValidator = require("../validators/productValidator");

router.post("/",verifyToken,checkPermission("add_products"),combinedUploader.uploadAll,combinedUploader.validateImageDimensions, productValidator.addProductValidator,productValidator.validate,productController.addProduct);


//Get all products
router.get('/', verifyToken,checkPermission('view_products'), productController.getAllProducts);
//?page=2&limit=5 for pagination

//  Update product
router.put('/:id', verifyToken,checkPermission('update_products'),combinedUploader.uploadAll,combinedUploader.validateImageDimensions,productValidator.updateProductValidator,productValidator.validate,  productController.updateProduct);

// Delete product
router.delete('/:id',verifyToken, checkPermission('delete_products'), productController.deleteProduct);
//delete images
router.delete(
  '/:id/image/:imageName',
  verifyToken,
  checkPermission('update_products'),
  productController.deleteProductImage
);


router.post('/bulk-upload',verifyToken, checkPermission('add_products'),  uploadBulk.single('file'), productController.bulkUpload);

module.exports = router;
