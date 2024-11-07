const {body} = require("express-validator");

// registration validation 
const validateUserRegistration = [
    body("name").trim().notEmpty()
    .withMessage("Name is required.")
    .isLength({min: 3, max: 31})
    .withMessage('Name should be at least 3-31 char long.'),

    body("email").trim().notEmpty()
    .withMessage("Email is required.")
    .isEmail().withMessage('Invalid Email Address'),
    
    body("password").trim().notEmpty()
    .withMessage("Password is required.")
    .isLength({min: 6})
    .withMessage('Password should be at least 6 characters long'),
    
    body("address").trim().notEmpty()
    .withMessage("Password is required.")
    .isLength({min: 3}).withMessage('Address should be at least 3 characters long'),
    
    body("phone").trim().notEmpty()
    .withMessage("Phone is required."),

    body("image").optional().isString()
    .custom((value, { req }) => {
        if(!req.file || !req.file.buffer){
            throw new Error('User image is required');
        }
        return true;
    }).withMessage('Address should be at least 3 characters long'),
    
];


// sign in validation

module.exports = {validateUserRegistration};