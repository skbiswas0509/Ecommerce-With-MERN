const createError = require('http-errors');
const jwt  = require('jsonwebtoken');
const { jwtAcessKey } = require('../src/secret');

const isLoggedIn = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if(!token){
            throw createError(404, "Token not found.Please login.");
        }
        const decoded = jwt.verify(accessToken, jwtAcessKey);
        if(!decoded){
            throw createError(401, "Invalid access token.please login again");
        }
        req.body = decoded.user;
        next()
    } catch (error) {
        return next(error)
    }
}

const isLoggedOut = async (req, res, next) =>{
    try {
        const accessToken = req.cookies.accessToken;
        if(accessToken){
            try {
                const decoded = jwt.verify(accessToken, jwtAcessKey);
            if(decoded){
                throw createError(400, 'User is logged in');
            }
            } catch (error) {
                throw error;
            }
        }
        next()
    } catch (error) {
        return next(error)
    }
}

const isAdmin = async (req, res, next) => {
    try {
        console.log(req.user.isAdmin);
        if(!req.user.isAdmin){
            throw createError(403, "Forbidden.You must be an admin");
        }
        next();
    } catch (error) {
        return next(error);
    }
}
modules.export = {isLoggedIn, isLoggedOut, isAdmin}