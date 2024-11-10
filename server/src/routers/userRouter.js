const express = require("express");
const { handleBanUserById, handleUnbanUserById, handleUpdatePassword, handleForgetPassword, handleResetPassword, handleGetUsers, handleDeleteUserById, handleProcessRegister, handleActivateUserAccount } = require("../controllers/userController");
const uploadUserImage = require("../../middlewares/uploadFile");
const { validateUserRegistration, validateUserForgetPassword, validateUserResetPassword } = require("../validatiors/auth");
const {isLoggedIn, isLoggedOut, isAdmin} = require("../middlewares/auth")
const runValidation = require("../validators");
const userRouter = express.Router();
const { isLoggedIn, handleManagerUserStatusById } = require("../middlewares/auth.js");


userRouter.get("/",isLoggedIn, isAdmin, handleGetUsers);
userRouter.get("/:id([0-9a-fA-F]{24})",isLoggedIn, handleGetUserById);
userRouter.delete('/:id([0-9a-fA-F]{24})',isLoggedIn, handleDeleteUserById);
userRouter.post('/process-register', uploadUserImage.single('image'),isLoggedOut, validateUserRegistration, runValidation, handleProcessRegister);
userRouter.post('/verify', activateUserAccount);
userRouter.put("/:id([0-9a-fA-F]{24})", uploadUserImage.single('image'),isLoggedIn, handleUpdateUserById);
userRouter.post('/activate',isLoggedOut, handleActivateUserAccount);
userRouter.put('/manage-user/:id([0-9a-fA-F]{24})', isLoggedIn, isAdmin, handleManagerUserStatusById);
userRouter.put('/update-password', isLoggedIn, validateUserRegistration, runValidation, handleUpdatePassword)
userRouter.post('/forget-password/', validateUserForgetPassword,runValidation, handleForgetPassword)
userRouter.put('/reset-password', validateUserResetPassword, runValidation, handleResetPassword)
module.exports = userRouter;