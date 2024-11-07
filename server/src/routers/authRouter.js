const express = require("express");
const {handleLogin, handleLogout} = require("../controllers/authController");
const {isLoggedIn, isLoggedOut} = require("../middlewares/auth")
const authRouter = express.Router();



authRouter.post("/login",isLoggedOut, handleLogin);
authRouter.post('/logout',isLoggedin, handleLogout);

module.exports = authRouter;