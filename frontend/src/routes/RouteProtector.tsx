import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function RouteProtector(){
    const auth = useAuth();
    return auth.isAuth ? <Outlet/>:<Navigate to='/'/>;
}