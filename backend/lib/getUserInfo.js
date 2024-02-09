export default function getUserInfo(user){
    return{
        user:user.user,
        mail: user.mail,
        id: user.id || user._id,
        role: user.role
    };
}

