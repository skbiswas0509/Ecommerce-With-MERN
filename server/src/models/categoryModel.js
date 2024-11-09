const { Schema, model } = require("mongoose");

const categorySchema = new Schenma(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
            unique: true,
            minlength: [3, 'The length of category name is minimum 3 characters'],
        },
        slug: {
            type: String,
            required: [true, 'Category name is required'],
            lowercase: true,
            unique: true,
            minlength: [3, 'The length of category name is minimum 3 characters'],
        }
    },
    {timestamps: true}
);

const Category = model('Category', categorySchema);
module.exports = Category;