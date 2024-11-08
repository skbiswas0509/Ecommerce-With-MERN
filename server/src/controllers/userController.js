const createError = require("http-errors");
const jwt = require('jsonwebtoken');
const fs = require("fs").promises;
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const deleteImage = require("../helper/deleteImageHelper");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtActivationKey, clientURL } = require("../secret");
const emailWithNodeMail = require("../helper/email");
const runValidation = require("../validatiors");
const { handleUserAction, findUsers, findUserById, updateUserById } = require("../services/userService");


const handleGetUsers = async (req,res, next)=>{
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const {users, pagination} = await findUsers(search, limit, page);

        return successResponse(res, {
            statusCode: 200,
            message: "Users were returned successfully",
            payload:{
                users: users,
                pagination: pagination,
            }
        })
    } catch (error) {
        next(error)
    }
}

const handleGetUserById = async (req,res, next)=>{
    try {
        const id = req.params.id;
        const options = {password: 0};
        await deleteUserById(id, options);

        return successResponse(res, {
            statusCode: 200,
            message: "Users were returned successfully",
            payload: {user},
        })
    } catch (error) {
        
        next(error)
    }
}

const deleteUserById = async (req,res, next)=>{
    try {
        const id = req.params.id;
        const options = {password: 0};
        const user = await findWithId(User, id, options);

        const deletedUser = await User.findByIdAndDelete({_id:id, isAdmin: false})

        return successResponse(res, {
            statusCode: 200,
            message: "Users were deleted successfully",
        })
    } catch (error) {
        
        next(error)
    }

    if(user && user.image){
        await deleteImage(user.image);
    }
}

const processRegister = async (req, res, next)=> {
    try {
        const {name, email, password, phone, address} = req.body;
        
        const image = req.file?.path;

        if(!image){
            throw createError(400, 'Image file is required');
        }
        if(image.size > 1024 * 1024 * 2){
            throw createError(400, 'Image file size is biggerthan 2 MB')
        }

        const imageBufferString = image.buffer.toString('base64')
        const userExists = await User.exists({email: email});
        if(userExists){
            throw createError(409, 'User with this email already exists.')
        }

        // create jwt 

        const tokenPayload = {name, email, password, phone, address}
        
        if(image){
            tokenPayload.image = image;
        }
        const token = createJSONWebToken(tokenPayload, jwtActivationKey, '10m');
        // prepare email
        const emailData = {
            email,
            subject: 'Account Activation Email',
            html: `
            <h2>Hello ${name} !</h>
            <p>Please click here to link to <a href="${clientURL}/api/users/acitvate/${token}" target="_blank"> activate your account </a></p>
            `
        }

            // send email
        try {
            await emailWithNodeMail(emailData);
        } catch (emailError) {
            next(createError(500, 'Failed to send verification email'));
            return;
        }

        return successResponse(res, {
            statusCode: 200,
            message: `Please go to your ${email} for completeing registration process`,
            paylod: {token},
        })
        } catch (error) {
            next(error)
        }
}

const activateUserAccount = async (req, res, next)=> {
    try {
        const token = req.body.token;
        if(!token) throw createError(404, "token not found.");

        const decoded = jwt.verify(token, jwtActivationKey);
        if(!decoded) throw createError(401, "User was not able to verify");
        
        const userExists = await User.exists({email: decoded.email});
        if(userExists){
            throw createError(409, 'User with this email already exists.')
        }
        
        await User.create(decoded)
        return successResponse(res, {
            statusCode: 201,
            message: "User was registered successfully.",
        })
    } catch (error) {
        if( error.name == 'TokenExpiredError') {
            throw createError(401, 'Token has expired');
        }else if( error.name == 'JsonWebToken') {
            throw createError(401, 'Invalid Token');
        }else{
            throw error;
        }
        
    }
}

const handleUpdateUserById = async (req,res, next)=>{
    try {
        const userId = req.params.id;
        
        const updatedUser = await updateUserById(userId, req)
        
        return successResponse(res, {
            statusCode: 200,
            message: "Users were updated successfully",
            payload: updatedUser,
        })
    } catch (error) {
        
        next(error)
    }
}

const handleManageUserStatusById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const action = req.body.action;

        const successMessage = await handleUserAction(action, userId);
        return successResponse(res, {
            statusCode: 200,
            message: "Users were returned successfully",
            payload: users,
            pagination :{
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                previosPage: page - 1 > 0 ? page-1 : null,
                nextPage: page + 1 <= Math.ceil(count / limit) ? page +1 : null,
            }
        })
    } catch (error) {
        next(error);
    }
}


module.exports = {getUsers, handleGetUserById, deleteUserById, processRegister, activateUserAccount, handleUpdateUserById, handleManageUserStatusById}