//componente para manejar autorización en rutas

import { useContext,createContext, useState,useEffect } from "react";
import type { AuthResponse } from "../types/types";

interface AuthProviderProps{
    children: React.ReactNode;
}

const AuthContext = createContext({
    isAuth:false,
    getAccessToken: () => { },
    saveUser: (userData: AuthResponse )=>{},
});

export default function AuthProvider({children}: AuthProviderProps){
    const[isAuth,setIsAuth] = useState(false);
    const[accessToken,setAccessToken] = useState<string>('');
    const[refreshToken,setRefreshToken] = useState<string>('');

    function getAccessToken(){
        return accessToken;
    }
    
    function getRefreshToken(){

    }


    function saveUser(userData: AuthResponse) {
        console.log('Guardando usuario')
        //guarda en local la info del usuario.
        setAccessToken(userData.body.accessToken);
        
        setRefreshToken(userData.body.refreshToken);
        console.log(refreshToken);
        localStorage.setItem('token', JSON.stringify(userData.body.refreshToken));
        setIsAuth(true);
    }

    return(
        <AuthContext.Provider value={{isAuth, getAccessToken, saveUser}}>
            {children}
        </AuthContext.Provider>
    );
}


export const useAuth = () => useContext(AuthContext);