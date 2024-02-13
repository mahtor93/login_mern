//componente para manejar autorización en rutas

import { useContext,createContext, useState,useEffect } from "react";
import type { AccesTokenResponse, AuthResponse, User } from "../types/types";
import { API_URL } from "./constants";

interface AuthProviderProps{
    children: React.ReactNode;
}

const AuthContext = createContext({
    isAuth:false,
    getAccessToken: () => { },
    saveUser: (userData: AuthResponse )=>{},
    getRefreshToken: () => { },
});

export default function AuthProvider({children}: AuthProviderProps){
    const[isAuth,setIsAuth] = useState(false);
    const[accessToken,setAccessToken] = useState<string>('');
    const[user,setUSer]= useState<User>();
    //const[refreshToken,setRefreshToken] = useState<string>('');

    useEffect(()=>{},[])

    async function requestNewAccessToken(refreshToken:string){
        //obtener un token en caso de que no exista
        try{
            const response = await fetch(`${API_URL}/refresh-token`,{
                method:'POST',
                headers:
                {
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${refreshToken}`
                },
            });
            if(response.ok){
                const json = await response.json() as AccesTokenResponse;
                if(json.error){
                     throw new Error(json.error);
                }
                return json.body.accessToken;
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
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${accessToken}`
                }
            });
            if(response.ok){
                const json = await response.json();
                if(json.error){
                    throw new Error(json.error);
                }
                return json;
            }
        }catch(error){
            console.error(error);
            return null;
        }
    }

    async function checkAuth(){
        if(accessToken){
            return;
        }else{
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

    function getRefreshToken():string|null{
        const token = localStorage.getItem('Token');
        if(token){
            const { refreshToken } = JSON.parse(token);
            return refreshToken;
        }
        return null;
    }

    function saveUser(userData: AuthResponse) {
        saveSessionInfo(
            userData.body.user, 
            userData.body.accessToken, 
            userData.body.refreshToken);
    }

    return(
        <AuthContext.Provider value={{isAuth, getAccessToken, getRefreshToken, saveUser}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);