import jwt from 'jsonwebtoken';

function verifyAccessToken(){
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

function verifyRefreshToken(){
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
}


export { verifyAccessToken, verifyRefreshToken }