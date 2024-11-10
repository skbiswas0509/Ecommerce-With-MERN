const slugify = require('slugify');
const createError = require('http-errors');

const { successResponse } = require("./responseController");
const Category = require('../models/categoryModel');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../services/categoryService');

const handleCreateCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        await createCategory(name);

        return successResponse(res, {
            statusCode: 201,
            message: "Category was created successfully.",
        });
    } catch (error) {
        next(error)
    }
}

const handleGetCategoies = async ( res, next) => {
    try {
        const categories = await getCategories();
        return successResponse(res, {
            statusCode: 200,
            message: 'Categories were returned successfully',
            payload: categories,
        })
    } catch (error) {
        next(error)
    }
}

const handleGetCategory = async(req, res, params) => {
    try {
        const { slug } = req.body.params;
        const category = await getCategory(slug)
        if(!category){
            throw createError(404, 'Category not found');
        }
        return successResponse(res, {
        statusCode: 200,
        message: 'Single category was returned',
        payload: category,
    })
    } catch (error) {
        next(error)
    }
}

const handleUpdateCategory = async (req, res, next) => {
    try {
        const { name } =req.body;
        const { slug } = req.params;
        const updatedCategory  = await updateCategory(name, slug);
        if(!updatedCategory){
            throw createError(404, 'Category not found with this slug');
        }
        return successResponse(res, {
            statusCode: 200,
            message: 'Category was updated',
            payload: updatedCategory,
        })
    } catch (error) {
        next(error)
    }
}

const handleDeleteCategory = async (req, res, next) => {
    try {
        const { slug} = req.params;
        const result = await deleteCategory(slug);

        if(!result){
            throw createError(404, "Category not found with this slug");
        }
        return successResponse(res, {
            statusCode: 200,
            message: "Category was deleted",
    })
    } catch (error) {
        throw(error)
    }
}

module.exports = {handleCreateCategory, handleGetCategoies, 
    handleGetCategory, handleUpdateCategory, handleDeleteCategory}