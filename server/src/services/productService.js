const createError = require("http-errors");
const Product = require("../models/productModel");
const { default: slugify } = require("slugify");

const createProduct = async(productData, image) => {

    if(image && image.size > 1024 * 1024 * 2){
        throw createError(400, 'File too large');
    }
    if(image){
        productData.image = image;
    }
    const { name, description, price, quantity, shipping, category, imageBufferString} = productData;
    const productExists = await Product.exists({name: productData.name});
    if(productExists){
        throw createError(409, 'Product with this name is alread exists');
    }
    const product = await Product.create({...productData, slug: slugify(productData.name)})
    return product
}

const getProducts = async (page=1, limit=5) => {
    const products = await Product.find({}).populate('category').skip((page-1) * limit)
        .limit(limit).sort({createdAt: -1});
        if(!products){
            throw createError(404, "Products not found");
        }
        const count = await Product.find({}).countDocuments();
        return { products, count, totalPages: Math.ceil(count/limit)
            ,currentPage: page};
    }

const getProductBySlug = async (slug) => {
    const product = await Product.findOne({slug}).populate('category');
    if(!product){
        throw createError(400, "Product not found");
        return product;
    }
}
module.exports = {createProduct, getProducts, getProductBySlug}