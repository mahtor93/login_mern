import  jsonResponse from "../lib/jsonResponse.js"
import  UserSchema from "../schema/user.schema.js";

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
        const userx = new UserSchema();
        const exists = await userx.usernameExist(user);

        if(exists){
            res.status(400).json(jsonResponse(400, {error:"Username already exists"}));
        }
        const newUser = new UserSchema({user,mail,passwd});
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

        const loggedUser = UserSchema.findOne({ user });
        if(loggedUser){
            const correctPasswd = await loggedUser.comparePassword(passwd,loggedUser.passwd);
            if(correctPasswd){
                const accesToken = 'access_token';
                const refreshToken = 'refresh_token';
                res.status(200).json(jsonResponse(200, {authUser,accesToken,refreshToken}));
            }else{
                res.status(400).json(jsonResponse(400, {error:'User or password doesn\'t exists'}));
            }
            
        }else{
            res.status(400).json(jsonResponse(400, {error:'User or password doesn\'t exists'}));
        }


    }catch(error){
        console.error('authUser error:',error);
    }
}


export { registerUser, authUser };