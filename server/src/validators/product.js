const { body } =require("express-validator");

const validateProduct = [
    body('name').trim().notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 150 })
    .withMessage('Product name should be between at least 3 or 150 chars long'),
    
    body('description').trim().notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 3, max:150 })
    .withMessage('Product description should be between at least 3 or 150 chars long'),
    
    body('price').trim().notEmpty()
    .withMessage('Product price is required')
    .isLength({ min: 0})
    .withMessage('Product price must be a positive number'),

    body('category').trim().notEmpty()
    .withMessage('Product category is required'),

    body('quantity').trim().notEmpty()
    .withMessage('Product quantity is required')
    .isInt({ min: 1})
    .withMessage('Product qunatity must be a positive integer'),

    body('image').optional().isString()
    .withMessage('Product image is optional'),
]

module.exports = {validateProduct}