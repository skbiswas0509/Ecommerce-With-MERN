const cloudinary = require("../config/cloudinary")


const publicIdWithoutExtensionFromUrl = async(imageUrl) => {
    const pathSegments = imageUrl.split('/');

    // get the last segment
    const lastSegment = pathSegments[pathSegments.length-1];
    const valueWithExtension = lastSegment.replace("jpg", "");

    return valueWithExtension;
}

const deleteFileFromCloudinary = async (folderName, publicId, modelName) => {
    try {
        const {result} = await cloudinary.uploader.destroy(`${folderName}/${publicId}`);
        if(result != 'ok'){
            throw new Error(`${modelName} image was not deleted successfully`);
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {publicIdWithoutExtensionFromUrl, deleteFileFromCloudinary};