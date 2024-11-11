const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require('http-errors')
const User = require("../models/userModel");
const createJSONWebToken = require("../helper/jsonwebtoken");
const { jwtResetPasswordKey, clientURL } = require('../secret');
const { findWithId } = require('./findItem');
const { deleteFileFromCloudinary } = require('../helper/cloudinaryHelper');



const findUsers = async (search, limit, page) => {
    try {
        const searchRegExp = new RegExp(".*" + search + ".*", 'i');
    const filter = {
        isAdmin: {$ne: true},
        $or:[
            {name: {$regex: searchRegExp}},
            {email: {$regex: searchRegExp}},
            {phone: {$regex: searchRegExp}},
        ]
    };
    const options = {password: 0}

    const users = await User.find(filter, options).limit(limit).skip((page-1) * limit)
    const count = await User.find(filter).countDocuments();

    if(!users || users.length == 0) throw createError(404, "No users found.")
    

    return{ users,
        pagination :{
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previosPage: page - 1 > 0 ? page-1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page +1 : null,
        }
    }
    } catch (error) {
        throw error;
    }
}

const findUserById = async(id, options={}) => {
    try {
        const user  = await User.findById(id, options);
        if(!user){
            throw createError(404, 'User not found');
            payload: {user};
        }
        return user;
    } catch (error) {
        {
        if(error instanceof mongoose.Error.CastError){
            throw createError(400, 'imvalid Id');
        }
        throw (error);
    }
}
}

const deleteUserById = async(id, options={}) => {
    try {
        const existingUser = await User.findOne({_id: id})

        if(existingUser && existingUser.image){
            const publicId = await publicIdWithoutExtensionFromUrl(existingUser.image);
            deleteFileFromCloudinary("ecommerceMern/users", publicId, 'User');
        }

        const user = await User.findByIdAndDelete({
            _id: id,
            isAdmin: false,
        });
        if(user && user.image){
            await deleteImage(user.image);
        }
    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createError(400, 'imvalid Id');
        }
        throw (error);
    }
}

const updateUserById = async(userId, req) => {
    try {
        const options = { password: 0};
        const user = await findWithId(User, userId, options);
     
        const updateOptions = { new: true, runValidators: true, contenct: "query"};
        let updates = {};
        const allowedFields = ['name', 'password', 'phone', 'address']
        for(const key in req.body){
            if(allowedFields.includes(key)){
                    updates[key]=req.body[key];
                }
            else if(key == 'email'){
                throw createError(400, "Email cant be updated")
                }
        }
        const image = req.file;
        if(image){
            if(image.size > 1024 * 1024 * 2){
                throw createError(400, 'Image file size is biggerthan 2 MB')
            }
            updates.image = image.buffer.toString('base64');
            user.image != 'default.jpeg' && deleteImage(user.image);
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updates, updateOptions);

        if(!updatedUser){
            throw createError(404, 'User with this id doesnot exist')
        }
        return updatedUser;
    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createError(400, 'imvalid Id');
        }
        throw (error);
    }
}

const updateUserPasswordById = async(userId, email, oldPassword, newPassword, confirmedPassword) => {
    try {
        const user = await User.findOne({ email: email })
        if(!user){
            throw createError(404, "User was not found");
        }

        if(newPassword == confirmedPassword){
            throw createError(400, 'New password and confirmed password did not match');
        }
        
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isPasswordMatch){
            throw createError(401, 'Old password is not correct');
        }
        const filter = {userId};
        const update = {$set: {password: newPassword}}
        const updateOptions = {new: true};
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            updateOptions
        ).select('-password');
        if(!updatedUser){
            throw createError(400, 'User was not updated')
        }
        return updatedUser;
    } catch (error) {
        if (error instanceof mongoose.Error.CastError){
            throw createError(400, 'Invalid Id');
        }
    }
}

const handleUserAction = async (userId, action) => {
    try {
        let update;
        let successMessage;
        if(action == 'ban'){
            update = {isBanned: true};
            successMessage = "User was banned successfully";
        }else if (action == 'unban'){
            update = {isBanned: false};
            successMessage = "User was banned successfully";
        }else {
            throw createError( 400, "Invalid Action. Use 'ban' or 'unban'");
        }

        const updateOptions = { new: true, runValidators: true, context: 'query'};

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            update,
            updateOptions,
        ).select('-password');

        if(!updatedUser){
            throw createError(400, "User wasnt banned")
        }
        return successMessage;
    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createError(400, 'imvalid Id');
        }  
        throw(error)
    }
}

const forgetPasswordByEmail = async (email) => {
    try {
        const userData = await User.find({email: email});
        if(!userData){
            throw createError(404, 'Email is incorrect');
        }
        const token =  createJSONWebToken({email}, jwtResetPasswordKey, '10m');

        const emailData = {
            email,
            subject: 'Reset Password Email',
            html: `
            <h2>Hello ${userData.name} !</h>
            <p>Please click here to link to <a href="${clientURL}/api/users/reset-password/${token}" target="_blank"> Reset your account </a></p>
            `
        }
        sendEmail(emailData)
        return token;
    } catch (error) {
        throw error;
    }
}

const resetPassword = async (token, password) => {
    try {
        const decoded = jwt.verify(token, jwtResetPasswordKey);

        if(!decoded){
            throw createError(400, 'Invalid/Expired token');
        }
        const filter = {email: decoded.email}
        const update = {password: password}
        const options = {new: true}
        const updatedUser = await User.findByIdAndUpdate(
            filter,
            update,
            options,
        ).select('-password');

        if(!updatedUser){
            throw createError(400, 'Password reset failed');
        }
    } catch (error) {
        throw error;
    }
}



module.exports = {handleUserAction, findUsers, findUserById, deleteUserById, updateUserById, updateUserPasswordById, forgetPasswordByEmail, resetPassword};