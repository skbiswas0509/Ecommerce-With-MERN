const {body} = require("express-validator");

// registration validation 
const validateCategory = [
    body("name").trim().notEmpty()
    .withMessage("Category name is required.")
    .isLength({min: 3})
    .withMessage('Category name should be at least 3-31 char long.'),

];

module.exports = {validateCategory};