//componente para manejar autorización en rutas

import { useContext,createContext, useState,useEffect } from "react";
import type { AccessTokenResponse, AuthResponse, User } from "../types/types";
import { API_URL } from "./constants";

interface AuthProviderProps{
    children: React.ReactNode;
}

const AuthContext = createContext({
    isAuth:false,
    getAccessToken: () => { },
    saveUser: (_userData: AuthResponse )=>{},
    getRefreshToken: () => { },
    getUser: () => ({} as User | undefined),
});

export default function AuthProvider({children}: AuthProviderProps){
    const[isAuth,setIsAuth] = useState(false);
    const[accessToken,setAccessToken] = useState<string>('');
    const[user,setUSer]= useState<User>();
    //const[refreshToken,setRefreshToken] = useState<string>('');

    async function requestNewAccessToken(refreshToken:string){
        //obtener un token en caso de que no exista
        try{
            
            const response = await fetch(`${API_URL}/refresh-token`,{
                method:'POST',
                headers:
                {
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${refreshToken}`
                },
            });
            if(response.ok){
                
                const json = await response.json() as AccessTokenResponse;
                if(json.error){
                     throw new Error(json.error);
                }
                return json.body.accessToken;
            }else{
                
                throw new Error(response.statusText)
                
            }
            
        }catch(error){
            console.error(error);
            return null;
        }
    }

    async function getUserInfo(accessToken:string){
        //obtener las info del usuario que solicita el token
        try{
            const response = await fetch(`${API_URL}/user`,{
                method:'GET',
                headers:{
                    "Content-Type":"application/json",
                     Authorization:`Bearer ${accessToken}`
                }
            });
            if(response.ok){
                const json = await response.json();
                if(json.error){
                    throw new Error(json.error);
                }
                return json.body;
            }
        }catch(error){
            console.error(error);
            return null;
        }
    }

    async function checkAuth(){
        if(accessToken){
            //el usuario está autenticado
            console.log('el usuario ya está autenticado');
            return;
        }else{
            //usuario no autenticado
            const token = getRefreshToken();
            if(token){
                const newAccessToken = await requestNewAccessToken(token);
                if(newAccessToken){
                    const userInfo = await getUserInfo(newAccessToken);
                    if(userInfo){
                        saveSessionInfo(
                            userInfo, 
                            newAccessToken, 
                            token);
                    }
                }else{
                    console.log('esperando el access token')
                }
            }
        }
    }

    function saveSessionInfo(userInfo:User, accessToken:string,refreshToken:string){
        setAccessToken(accessToken);
        localStorage.setItem('token', JSON.stringify(refreshToken));
        setIsAuth(true);
        setUSer(userInfo);
    }


    function getAccessToken(){
        return accessToken;
    }

    function getRefreshToken(){
        const tokenData = localStorage.getItem('token');
        if(tokenData){
            const token = JSON.parse(tokenData);
            return token;
        }
        return null;
    }

    function saveUser(userData: AuthResponse) {
        saveSessionInfo(
            userData.body.user, 
            userData.body.accessToken, 
            userData.body.refreshToken);
    }

    function getUser(){
        return user;
    }


    useEffect(()=>{
        checkAuth() //nos permite checar si hay una autenticación de usuario actualmente.
    },[])

    return(
        <AuthContext.Provider value={{isAuth,getUser,getAccessToken, getRefreshToken, saveUser}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);