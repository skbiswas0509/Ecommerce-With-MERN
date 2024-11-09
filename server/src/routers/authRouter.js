const express = require("express");
const {handleLogin, handleLogout, handleRefreshToken, handleProtectedRoute} = require("../controllers/authController");
const {isLoggedIn, isLoggedOut} = require("../middlewares/auth");
const { validateUserLogin } = require("../validatiors/auth");
const runValidation = require("../validatiors");
const authRouter = express.Router();



authRouter.post("/login",validateUserLogin, runValidation, isLoggedOut, handleLogin);
authRouter.post('/logout',isLoggedin, handleLogout);
authRouter.get('/refresh-token', handleRefreshToken)
authRouter.get('/protected', handleProtectedRoute)

module.exports = authRouter;