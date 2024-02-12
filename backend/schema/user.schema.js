import Mongoose from "mongoose";
import bcrypt from 'bcrypt';
import getUserInfo from "../lib/getUserInfo.js";
import { generateAccessToken, generateRefreshToken } from "../auth/sign.js";
import Token from '../schema/token.schema.js'

const UserSchema = new Mongoose.Schema({
    id:{type:Object},
    user:{type:String,required:true,unique:true},
    passwd:{type:String, required:true},
    mail:{type:String, required:true},
    role:{type:String, default:'user',required:true}
});

UserSchema.pre('save', function(next){
    if(this.isModified('passwd')|| this.isNew){
        const document = this;
        bcrypt.hash(document.passwd, 10,(err,hash)=>{
            if(err){
                next(err);
            }else{
                document.passwd = hash;
                next();
            }
        })
    }else{
        next();
    }
})

UserSchema.methods.usernameExist = async function(user){
    const result = await Mongoose.model('User').find({user:user});
    return result.length >0;
};

UserSchema.methods.comparePassword = async function(passwd,hash){
    const same = await bcrypt.compare(passwd,hash);
    return same;
}

UserSchema.methods.createAccessToken = function(){
    return generateAccessToken(getUserInfo(this));
}

UserSchema.methods.refreshAccessToken = async function(next){
    const refreshToken = generateRefreshToken(getUserInfo(this));
    try{
        await new Token({ token:refreshToken}).save();
        console.log('Token saved ', refreshToken);
        return refreshToken;
    }catch (error){
        console.error(error);
    }
}


export default Mongoose.model('User', UserSchema);