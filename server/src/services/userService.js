const mongoose = require('mongoose');

const createError = require('http-errors')
const User = require("../models/userModel");



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
        const user = await findUserById(userId, options);
     
        const updateOptions = { new: true, runValidators: true, contenct: "query"};
        let updates = {};
        const allowedFields = ['name', , 'password', 'phone', 'address']
        for(let key in req.body){
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
module.exports = {handleUserAction, findUsers, findUserById, deleteUserById, updateUserById};