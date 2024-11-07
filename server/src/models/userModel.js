const {Schema, model} = require("mongoose");

const bcrypt = require("bcryptjs");
const { defaultImagePath } = require("../secret");

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        maxlength: [31, 'User name can be maximum 31 char'],
        minLength: [3, 'User name can be minimum 3 char']
    },
    email: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: 'Please enter a valid email.'
        }
    },
    password: {
        type: String,
        required: [true, 'User password is required'],
        minLength: [6, 'User password can be minimum 3 char'],
        set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
        type: Buffer,
        contentType: String,
        required: [true, 'User image is required']

    },
    address: {
        type: String,
        required: [true, 'User address is required'],
        minLength: [3, 'User name can be minimum 3 char']
    },
    phone: {
        type: String,
        required: [true, 'User phone is required'],
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isbanned: {
        type: Boolean,
        default: false
    },
}, {timestamps:true});

const User = model('Users', userSchema);
module.exports = User;