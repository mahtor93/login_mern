//componente para manejar autorización en rutas

import { useContext,createContext, useState,useEffect } from "react";
import type { AuthResponse } from "../types/types";

interface AuthProviderProps{
    children: React.ReactNode;
}

const AuthContext = createContext({
    isAuth:false,
    getAccessToken: () => { },
    saveUser: (_userData: AuthResponse )=>{},
});

export default function AuthProvider({children}: AuthProviderProps){
    const[isAuth,setIsAuth] = useState(false);
    const[accessToken,setAccessToken] = useState('');
    const[refreshToken,setRefreshToken] = useState('');

    function getAccessToken(){
        return accessToken;
    }

    function saveUser(userData: AuthResponse) {
        console.log('Guardando usuario')
        //guarda en local la info del usuario.
        setAccessToken(userData.body.accessToken);
        setRefreshToken(userData.body.refreshToken);
        localStorage.setItem('token', JSON.stringify(userData.body.refreshToken));
        document.cookie =`accessToken=${userData.body.accessToken} expires=Thu,1 Jan 1970 00:00:00 UTC; path=/`;
        document.cookie =`refreshToken=${userData.body.refreshToken} expires=Thu,1 Jan 1970 00:00:00 UTC; path=/`;
        setIsAuth(true);
    }

    return(
        <AuthContext.Provider value={{isAuth, getAccessToken, saveUser}}>
            {children}
        </AuthContext.Provider>
    );
}


export const useAuth = () => useContext(AuthContext);