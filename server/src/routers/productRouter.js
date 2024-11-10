const express  = require("express");
const { handleCreateProduct, handleGetProducts, handleGetProduct } = require("../controllers/productController");
const { validateProduct } = require("../validators/product");
const runValidation = require("../validators");
const {isLoggedIn, isLoggedOut, isAdmin} = require("../middlewares/auth");
const { uploadProductImage } = require("../../middlewares/uploadFile");


const productRouter = express.Router()

productRouter.post('', uploadProductImage.single('image'),validateProduct, 
runValidation, isLoggedIn, isAdmin, handleCreateProduct)
productRouter.get('/', handleGetProducts);
productRouter.get('/:slug', handleGetProduct);

module.exports = productRouter;
