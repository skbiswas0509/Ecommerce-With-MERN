const mongoose = require("mongoose");
const { mongodbUrl } = require("../secret");

const connectDB = async (options) =>{
    try {
        await mongoose.connect(mongodbUrl, options);
        console.log("Connection to DB is successful");

        mongoose.connection.on('error', (error)=>{
            console.error('Db connection error:', error);
        })
    } catch (error) {
        console.error('Couldnt connected to DB:', error.toString());
    }
};

module.exports = connectDB;