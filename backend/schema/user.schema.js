import Mongoose from "mongoose";
import bcrypt from 'bcrypt';


const UserSchema = new Mongoose.Schema({
    id:{type:Object},
    user:{type:String,required:true,unique:true},
    passwd:{type:String, required:true},
    mail:{type:String, required:true},
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



export default Mongoose.model('User', UserSchema);