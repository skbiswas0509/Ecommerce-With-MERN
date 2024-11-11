const cloudinary = require("../config/cloudinary")

const createError = require("http-errors");
const Product = require("../models/productModel");
const { default: slugify } = require("slugify");
const { deleteFileFromCloudinary, publicIdWithoutExtensionFromUrl } = require("../helper/cloudinaryHelper");


const createProduct = async(productData, image) => {

    if(image && image.size > 1024 * 1024 * 2){
        throw createError(400, 'File too large');
    }
    if(image){
        const response = await cloudinary.uploader.upload(image, {
            folder: 'ecommerceMern/products',
        });
        decoded.image = response.secure_url;
    }
    const { name, description, price, quantity, shipping, category, imageBufferString} = productData;
    const productExists = await Product.exists({name: productData.name});
    if(productExists){
        throw createError(409, 'Product with this name is alread exists');
    }
    const product = await Product.create({...productData, slug: slugify(productData.name)})
    return product
}

const getProducts = async (page=1, limit=5, filter={}) => {
    const products = await Product.find(filter).populate('category').skip((page-1) * limit)
        .limit(limit).sort({createdAt: -1});
        if(!products){
            throw createError(404, "Products not found");
        }
        const count = await Product.find(filter).countDocuments();
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

const deleteProductBySlug = async (slug) => {
    try {
        const existingProduct = await Product.findOneAndDelete({ slug });
    if(!existingProduct) throw createError(404, "Product not found");
    if(existingProduct.image){
        const publicId = await publicIdWithoutExtensionFromUrl(existingProduct.image);
        deleteFileFromCloudinary("ecommerceMern/products", publicId, 'Product')
    }
        await Product.findOneAndDelete({slug});
    } catch (error) {
        throw error;
    }
}

const updateProductBySlug = async (req, slug) => {
    
    try {
        const product = await Product.findOne({slug: slug})
        if(!product){
            throw createError(404, 'Product not found');
        }
        const updateOptions = { new: true, runValidators: true, context: 'query'};
        let updates = {};

        const allowedFields = ['name', 'description', 'price', 'sold',
            'quantity', 'shipping'];
        
        for (const key in req.body){
            if(allowedFields.includes(key)){
                if(key == 'name'){
                    updates.slug = slugify(req.body[key]);
                }
                updates[key] = req.body[key];
            }
        }

        const image = req.file?.path;
        if(image){
            if(image.size > 1024 * 1024 * 2) {
                throw new Error('FIle too large.');
            }
            const response = await cloudinary.uploader.upload(image,{
                folder: 'ecommerce/products',
            });
            updates.image = response.secure_url;
        }
        
        const updatedProduct = await Product.findOneAndUpdate(
            {slug},
            updates,
            updateOptions)
        if(!updatedProduct){
            throw createError(404, 'Product update was not possible');
        }

        if(product.image){
            const publicId = await publicIdWithoutExtensionFromUrl(product.image);
            await deleteFileFromCloudinary('ecommerceMern/products',publicId,'Product');
        }
        
        return updatedProduct;
    } catch (error) {
        
    }
}

module.exports = {createProduct, getProducts, 
    getProductBySlug, deleteProductBySlug, updateProductBySlug}