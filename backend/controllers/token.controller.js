import { getTokenFromHeader }  from "../auth/getTokenFromHeader.js"
import jsonResponse from '../lib/jsonResponse.js';
import Token from '../schema/token.schema.js'
import { verifyRefreshToken } from '../auth/verifyTokens.js'
import { generateAccessToken } from "../auth/sign.js";

async function refreshToken(req,res){
    const refreshToken = getTokenFromHeader(req.headers);

    if(refreshToken){

        try{
            const foundToken = await Token.findOne({ token: refreshToken });

            if(!foundToken){
                return res.status(401).send(jsonResponse(401, {error:'No autorizado >:('}));
            }
            const payload = verifyRefreshToken(foundToken.token);
            if(payload){
                const accessToken = generateAccessToken(payload.user)
                return res.status(200).json(jsonResponse(200, { accessToken }));
            }else{
                return res.status(401).send(jsonResponse(401, {error: 'No Autorizado >:('}))
            }

        }catch(error){

        }
    }else{
        res.status(401).send(jsonResponse(401, {error:'No Token :('}));
    }
}

export { refreshToken }