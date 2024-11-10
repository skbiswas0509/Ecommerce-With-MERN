const {Schema, model} = require('mongoose');
const { defaultImagePath } = require('../secret');

const productSchema = new Schema({
    name:{
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        minlength: [3, "Min length of product is 3"],
        maxlength: [150, "Min length of product is 150"],
    },
    slug:{
        type: String,
        required: [true, "Product slug is required"],
        trim: true,
        lowercase: true,
        unique: true,
    },
    description:{
        type: String,
        required: [true, "Product description is required"],
        trim: true,
        minlength: [3, "Min length of product description is 3"],
        maxlength: [150, "Min length of product description is 150"],
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        validate: {
            validator: function (v) {
                return v > 0;
            },
            message: (props) =>
                `${props.value} is not a valid price.`
        }
    },
    quantity: {
        type: Number,
        required: [true, "Product quantity is required"],
        validate: {
            validator: function (v) {
                return v > 0;
            },
            message: (props) =>
                `${props.value} is not a valid quantity.`
        }
    },
    sold: {
        type: Number,
        required: [true, "Sold price is required"],
        trim: true,
        default: 0,
        validate: {
            validator: function (v) {
                return v > 0;
            },
            message: (props) =>
                `${props.value} is not a valid sold quantity.`
        }
    },
    shipping: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
        default: defaultImagePath,
    },
    category: {
        type: Schema.Types.ObjectId,
        erf: 'Category',
        required: true,
    }
},
{ timestamps: true }
);

const Product = model('Product', productSchema);
module.exports = Product