const createError = require("http-errors");
const Product = require("../models/productModel");

const createProduct = async(productData) => {
    try {

        const { name, description, price, quantity, shipping, category, imageBufferString} = productData;
        const productExists = await Product.exists({name: name});
        if(productExists){
            throw createError(409, 'Product with this name is alread exists');
        }
        const product = await Product.create({
            name: name,
            slug: slugify(name),
            description: description,
            price: price,
            quantity: quantity,
            shipping: shipping,
            image: imageBufferString,
            category: category,
        })
        return product
    } catch (error) {
        throw(error)
    }
}

module.exports = {createProduct}