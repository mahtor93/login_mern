import  express  from "express";
import  jsonResponse from "../lib/jsonResponse.js";
import { registerUser,authUser } from "../controllers/user.controller.js";
import { refreshToken } from "../controllers/token.controller.js";
import { authenticate } from "../auth/authenticate.js";
const router = express.Router();



router.get('/dashboard', authenticate,(req,res)=>{
    res.send('Dashboard')
});

router.get('/user', authenticate,(req,res)=>{
    res.status(200).json(jsonResponse(200, req.user));
});

router.get('/logout', authenticate,(req,res)=>{
    res.send('Logout')
});

router.get('/login',(req,res)=>{res.send('Login')});
router.post('/login', authUser);

router.get('/refresh-token',(req,res)=>{
    res.send('Refresh Token')
});

router.post('/refresh-token', refreshToken)

router.get('/register',(req,res)=>{res.send('Register');});
router.post('/register',registerUser);

export default router;

/*
router.post('/api/register',(req,res)=>{
    const { user, mail, passwd } = req.body;

    if(!user || !mail || !passwd){
        return res.status(400).json(
            jsonResponse(400,{
                error:"Campos requeridos"
            })
        );
    }
    //Crear usuario
    res.status(200).json(jsonResponse(200, {message:"User Created successfully"}));
});
*/