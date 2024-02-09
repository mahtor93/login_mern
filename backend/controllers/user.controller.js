import  jsonResponse from "../lib/jsonResponse.js"
import  User from "../schema/user.schema.js";
import  getUserInfo from "../lib/getUserInfo.js";

async function registerUser( req,res){
    try{
        const { user,mail,passwd} = req.body;

        if(!user || !mail || !passwd){
            return res.status(400).json(
                jsonResponse(400,{
                    error:"Campos requeridos"
                })
            );
        }
        //Crear usuario
        const userx = new User();
        const exists = await userx.usernameExist(user);

        if(exists){
            res.status(400).json(jsonResponse(400, {error:"Username already exists"}));
        }
        const newUser = new User({user,mail,passwd});
        await newUser.save();
        res.status(200).json(jsonResponse(200, {message:"User created successfully"}));
    }catch(error){
        console.error('registerUser error : ',error);
    }
}

async function authUser(req,res){
    try{
        const { user,passwd } = req.body;
        if(!user||!passwd){
            return res.status(400).json(
                jsonResponse(400,{
                    error:'Campos Requeridos'
                })
            );
        }

        const loggedUser = await User.findOne({ user });
        if(loggedUser){
            const correctPasswd = await loggedUser.comparePassword(passwd,loggedUser.passwd);
            if(correctPasswd){
                const accessToken = loggedUser.createAccessToken();
                const refreshToken = loggedUser.refreshAccessToken();
                res.status(200).json(jsonResponse(200, {accessToken,refreshToken,user:getUserInfo(loggedUser)}));
            }else{
                res.status(400).json(jsonResponse(400, {error:'Invalid username or password'}));
            }
            
        }else{
            res.status(400).json(jsonResponse(400, {error:'Invalid username or password'}));
        }


    }catch(error){
        console.error('authUser error:',error);
    }
}


export { registerUser, authUser };