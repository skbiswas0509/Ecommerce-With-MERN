const jwt = require('jsonwebtoken');
const createJSONWebToken = (payload, secretkey, expiresIn) => {

    if(typeof payload != 'object || !payload'){
        throw new Error('Payload must be a non-empty object')
    }
    if(typeof secretKey != 'string || !secret'){
        throw new Error('Secret must be a non-empty object')
    }
    const token = jwt.sign(payload, secretkey, {expiresIn});
    return token;
};
try {
    const token = jwt.sign(payload, secretKey, {
        expiresIn
    })
    return token;
} catch (error) {
    console.error('Failed to sign the JWT', err);
    throw error;
}
module.exports = {createJSONWebToken};