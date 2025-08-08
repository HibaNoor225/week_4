const express = require('express');
const router = express.Router();
const productController = require('../Controller/productController');
const  verifyToken  = require('../middleware/authMiddleware');
const checkPermission  = require('../middleware/roleMiddleware.js');


router.use(verifyToken);

//  Add product
router.post('/', checkPermission('add_products'), productController.addProduct);

//Get all products
router.get('/', checkPermission('view_products'), productController.getAllProducts);

//  Update product
router.put('/:id', checkPermission('update_products'), productController.updateProduct);

// Delete product
router.delete('/:id', checkPermission('delete_products'), productController.deleteProduct);

module.exports = router;
