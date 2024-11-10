const createError = require("http-errors");

const { successResponse } = require("./responseController");
const { default: slugify } = require("slugify");
const { createProduct } = require("../services/productService");

const handleCreateProduct = async(req, res, next) => {
    try {
        const { name, description, price, quantity, shipping, category} = req.body;
        const image = req.file;

        if(!image){
            throw createError(400, 'Image file is required');
        }
        if(image.size > 1024 * 1024 * 2){
            throw createError(400, 'Image file is bigger than 2 mb');
        }

        const imageBufferString = image.buffer.toString('base64');

        const productData = {name, description, price, category, quantity, shipping, imageBufferString}
        const product = await createProduct(productData);

        return successResponse(res, {
            statusCode: 201,
            message: "Product was created successfully.",
            payload: product,
        });
    } catch (error) {
        next(error);
    }
}



module.exports = {handleCreateProduct}