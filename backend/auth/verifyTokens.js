import jwt from 'jsonwebtoken';

function verifyAccessToken(token){
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

function verifyRefreshToken(token){
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
}


export { verifyAccessToken, verifyRefreshToken }