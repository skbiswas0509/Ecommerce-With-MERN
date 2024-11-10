const createError = require("http-errors");

const { successResponse } = require("./responseController");
const { default: slugify } = require("slugify");
const { createProduct, getProducts } = require("../services/productService");
const Product = require("../models/productModel");

const handleCreateProduct = async(req, res, next) => {
    try {
    
        const image = req.file?.path;
        const product = await createProduct(req.body, image);

        return successResponse(res, {
            statusCode: 201,
            message: "Product was created successfully.",
            payload: product,
        });
    } catch (error) {
        next(error);
    }
}

const handleGetProducts = async (req, res, next) =>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        
        const productsData = await getProducts(page, limit);


        return successResponse(res, {
            statusCode: 200,
            message: "Returned all the products",
            payload: {products: productsData.products, 
                pagination: {
                    totalPages: productsData.totalPages,
                    currentPage: productsData.currentPage,
                    previousPage: productsData.currentPage - 1,
                    nextPage: productsData.currentPage + 1,
                    totalNumberOfProducts: productsData.count,
                }
            },
        })
    } catch (error) {
        next(error)
    }
}

const handleGetProduct = async (req, res, next) => {
    try {
        const {slug} = req.params;
        const product = await getProductBySlug(slug);
        return successResponse(res, {
            statusCode: 200,
            message: 'returned the product',
            payload: {product},
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {handleCreateProduct, handleGetProducts, 
    handleGetProduct}