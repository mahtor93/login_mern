//componente para manejar autorización en rutas

import { useContext,createContext, useState,useEffect } from "react";

interface AuthProviderProps{
    children: React.ReactNode;
}
const AuthContext = createContext({
    isAuth:false,
});

export default function AuthProvider({children}: AuthProviderProps){
    const[isAuth,setIsAuth] = useState(false);
    return(
        <AuthContext.Provider value={{isAuth}}>
            {children}
        </AuthContext.Provider>
    );
}


export const useAuth = () => useContext(AuthContext);