const createError = require('http-errors');
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { successResponse } = require('./responseController');
const { jwtAcessKey } = require('../secret');
const { setAccessTokenCookie, setRefreshTokenCookie } = require('../helper/cookie');

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
        setAccessTokenCookie(res, accessToken);

        const refreshToken = createJSONWebToken({user},
            jwtRefreshKey,'7d');
        setRefreshTokenCookie(res, refreshToken);

        const userWithoutPassword = user.toObject()
        delete userWithoutPassword.password;
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
        res.clearCookie('refreshToken');
        return successResponse(res, {
            statusCode: 200,
            message: "Users logout successfully.",
            payload: {}
        })
    } catch (error) {
        next(error)
    }
}

const handleRefreshToken = async(req, res, next) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;

        //verify th old efresh token
        const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey)
        if(!decodedToken){
            throw createError(401, 'Invalid refresh token');
        }
        const accessToken = createJSONWebToken(decodedToken.user,
            jwtAccessKey,'15m');
            setAccessTokenCookie(res, accessToken);

        return successResponse(res, {
            statusCode: 200,
            message: "New access token generated.",
            payload: {}
        })
    } catch (error) {
        next(error)
    }
}

const handleProtectedRoute = async(req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        //verify th old efresh token
        const decodedToken = jwt.verify(accessToken, jwtAcessKey)
        if(!decodedToken){
            throw createError(401, 'Invalid refresh token');
        }
        return successResponse(res, {
            statusCode: 200,
            message: "Protected resources accessed",
            payload: {}
        })
    } catch (error) {
        next(error)
    }
}
module.exports = {handleLogin, handleLogout, 
    handleRefreshToken, handleProtectedRoute};