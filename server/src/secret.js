require('dotenv').config();

const serverPort = process.env.SERVER_PORT || 3001;
const mongodbUrl = process.env.mongodbUrl;

const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH || './public/images/users/default.png'

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || 'fgiuasfga';
const jwtAcessKey = process.env.JWT_ACCESS_KEY || 'sdsdas'
const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY || 'sdsd' 
const smtpUsername = process.env.SMTP_USERNAME || '';
const jwtRefreshKey = process.env.JWT_REFRESH_KEY || 'sdsdas'

const smtpPassword = process.env.SMTP_PASSWORD || '';

const clientURL = process.env.CLIENT_URL || '';



module.exports = {serverPort, mongodbUrl, defaultImagePath, jwtActivationKey, smtpUsername, smtpPassword, clientURL, 
    jwtAcessKey, jwtResetPasswordKey, jwtRefreshKey}