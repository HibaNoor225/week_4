const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/responseFormatter');

class productValidator {

  addProductValidator = [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Product name is required"),

    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .toFloat()
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number"),

    body("category")
      .trim()
      .notEmpty()
      .withMessage("Category is required"),

    body("stock")
      .notEmpty()
      .withMessage("Stock is required")
      .toInt()
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),
  ];

  updateProductValidator = [
    body("name")
      .optional()
      .trim()
      .isString()
      .withMessage("Name must be a string"),

    body("price")
      .optional()
      .toFloat()
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number"),

    body("category")
      .optional()
      .trim()
      .isString()
      .withMessage("Category must be a string"),

    body("stock")
      .optional()
      .toInt()
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),
  ];

  validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', 400, errors.array());
    }
    next();
  };
}

module.exports = new productValidator();
