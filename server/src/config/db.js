const mongoose = require("mongoose");
const { mongodbUrl } = require("../secret");
const logger = require("../controllers/loggerController");

const connectDB = async (options) =>{
    try {
        await mongoose.connect(mongodbUrl, options);
        logger.log("info","Connection to DB is successful");

        mongoose.connection.on('error', (error)=>{
            logger.log('error', 'Db connection error:', error);
        })
    } catch (error) {
        logger.error('error','Couldnt connected to DB:', error.toString());
    }
};

module.exports = connectDB;