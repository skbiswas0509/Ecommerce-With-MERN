const createError = require('http-errors');
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { successResponse } = require('./responseController');

const handleLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            throw createError(404, "User doesn't exist with this email. Please register");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw createError(401, "Email and password did not match");
        }

        if (user.isBanned) {
            throw createError(403, "You are banned.");
        }

        // generating tokens, cookies
        const accessToken = createJSONWebToken({user},
        jwtAccessKey,'15m');
        res.cookie('access_token', accessToken,{
            maxAge: 15* 60 * 1000, // 15 min,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        })

        const userWithoutPassword = await User.findOne({ email }).select('-password');
        return successResponse(res, {statusCode: 200,
            message: "Login successful",
            payload: {userWithoutPassword},
        })
    }catch (error) {
        next(error);
    }
}

const handleLogout = async(req, res, next) => {
    try {
        res.clearCookie('accessToken');
        return successResponse(res, {
            statusCode: 200,
            message: "Users logout successfully.",
            payload: {}
        })
    } catch (error) {
        next(error)
    }
}
module.exports = {handleLogin, handleLogout};