import DefaultLayout from "../layout/DefaultLayout";
import { useAuth } from "../auth/AuthProvider";

export default function Dashboard(){
    const auth = useAuth();

    return(
    <DefaultLayout>
        <h1>Dashboard de {auth.getUser()?.user || "anonnymous"}</h1>
        
    </DefaultLayout>
    );
}