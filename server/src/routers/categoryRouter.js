const express = require("express")

const { handleCreateCategory, handleGetCategoies, handleUpdateCategory, handleDeleteCategory } = require("../controllers/categoryController");
const runValidation = require("../validators");
const { validateCategory } = require("../validators/category");
const { isLoggedIn, isAdmin } = require("../middlewares/auth")


const categoryRouter = express.Router();

categoryRouter.post('/',validateCategory,runValidation, isLoggedIn, isAdmin, handleCreateCategory)
categoryRouter.get('/', handleGetCategoies);
categoryRouter.get('/:slug', handleGetCategory)
categoryRouter.put('/:slug',validateCategory, runValidation, isLoggedIn, isAdmin, handleUpdateCategory)
categoryRouter.delete('/:slug', isLoggedIn, isAdmin, handleDeleteCategory)

module.exports = categoryRouter;