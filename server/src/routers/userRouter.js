const express = require("express");
const { getUsers, getUserById, deleteUserById, processRegister, activateUserAccount, updateUserById, handleBanUserById, handleUnbanUserById } = require("../controllers/userController");
const uploadUserImage = require("../../middlewares/uploadFile");
const { validateUserRegistration } = require("../validatiors/auth");
const {isLoggedIn, isLoggedOut, isAdmin} = require("../middlewares/auth")
const runValidation = require("../validatiors");
const userRouter = express.Router();
const { isLoggedIn, handleManagerUserStatusById } = require("../middlewares/auth.js");


userRouter.get("/",isLoggedIn, isAdmin, getUsers);
userRouter.get("/:id",isLoggedIn, handleGetUserById);
userRouter.delete('/:id',isLoggedIn, deleteUserById);
userRouter.post('/process-register', uploadUserImage.single('image'),isLoggedOut, validateUserRegistration, runValidation, processRegister);
userRouter.post('/verify', activateUserAccount);
userRouter.put("/:id", uploadUserImage.single('image'),isLoggedIn, handleUpdateUserById);
userRouter.post('/activate',isLoggedOut, activateUserAccount);
userRouter.put('/manage-user/:id', isLoggedIn, isAdmin, handleManagerUserStatusById);



module.exports = userRouter;