import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({
    path:'.env'
})

function sign(payload,isAccessToken){
    return jwt.sign(
        payload, //lo que queremos guardar en la BD, info del usuario a encriptar
        isAccessToken
            ? process.env.ACCESS_TOKEN_SECRET
            : process.env.REFRESH_TOKEN_SECRET,
            {
                algorithm:"HS256",
                expiresIn:3600, //3600 segundos. 1 hora
            }
    );
}

function generateAccessToken(user){
    return sign({user},true);
}
function generateRefreshToken(user){
    return sign({user},false);
}

export { generateAccessToken, generateRefreshToken }