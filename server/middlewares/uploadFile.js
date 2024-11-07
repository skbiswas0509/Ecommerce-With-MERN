const multer = require('multer');
const { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } = require('../src/config');


const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_USER_IMG_DIRECTORY);
  },
  filename: function (req, file, cb){
    cb(null, Date.now() + '-' + file.originalname);
  }
});
  
const fileFilter = (req,file,cb) => {
    if(!file.mimetype.startWith('image/')){
      return cb(new Error('Only Image files are allowed'), false);
    }
    if(file.size > MAX_FILE_SIZE){
      return cb(new Error('File size exceeds the max limit'), false);
    }
    if(!ALLOWED_FILE_TYPES.includes(file.mimetype)){
      return cb(new Error('File extention is not allowed'), false);
    }
    cb(null, true);
};

const uploadUserImage = multer({
  storage: userStorage,
  limits: {fileSize: MAX_FILE_SIZE},
  fileFilter:fileFilter
})

module.exports = uploadUserImage;