//componente para manejar autorización en rutas

import { useContext,createContext, useState,useEffect } from "react";
import type { AccesTokenResponse, AuthResponse } from "../types/types";
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
    //const[refreshToken,setRefreshToken] = useState<string>('');

    useEffect(()=>{},[])

    async function requestNewAccessToken(refreshToken:string){
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
                return json.body.accesToken;
            }
            
        }catch(error){
            console.error(error);
            return null;
        }
    }


    async function checkAuth(){
        if(accessToken){

        }else{
            const token = getRefreshToken();
            if(token){

            }
        }
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
        //guarda en local la info del usuario.
        setAccessToken(userData.body.accessToken);
       // setRefreshToken(userData.body.refreshToken);
        localStorage.setItem('token', JSON.stringify(userData.body.refreshToken));

        setIsAuth(true);
    }

    return(
        <AuthContext.Provider value={{isAuth, getAccessToken, getRefreshToken, saveUser}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);