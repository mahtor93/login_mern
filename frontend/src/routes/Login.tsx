import { useAuth } from "../auth/AuthProvider";
import DefaultLayout from "../layout/DefaultLayout";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../auth/constants";
import { AuthResponseError, AuthResponse } from "../types/types";

export default function Login(){
    const [user,setUser] = useState('');
    const [passwd,setPasswd] = useState('');
    const [errorResponse, setErrorResponse] = useState('');
    const [isUser, setIsUser] = useState(true);
    const [isPass, setIsPass] = useState(true);
    const auth = useAuth();
    const goTo = useNavigate();

    const timestamp = Date.now();

    async function handleLogin(e: React.FormEvent){
        e.preventDefault();

            try{
                const response = await fetch(`${API_URL}/login`,{
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({
                        user,
                        passwd
                    })
                });
                if(response.ok){
                    console.log('Logged In',timestamp);
                    setErrorResponse('');
                    
                    const json = (await response.json()) as AuthResponse;
                    console.log(json)
                    if(json.body.accessToken && json.body.refreshToken){
                        auth.saveUser(json);
                    }

                    goTo('/dashboard');

                }else{
                    console.log('Something went wrong',timestamp)
                    const json = (await response.json()) as AuthResponseError;
                    setErrorResponse(json.body.error);
                }
            }catch(error){
                console.error('Error HandleLogin:',error,timestamp)
            }
        
    }

    if(auth.isAuth){
        return <Navigate to ='/dashboard'></Navigate>
    }

    function handleValidations(){
        user?setIsUser(true):setIsUser(false);
        passwd?setIsPass(true):setIsPass(false);
    }

    return ( 
        <DefaultLayout>
            <form className="form" onSubmit={handleLogin}>
                <h1>Login</h1>
                {!!errorResponse && <div className="errorMessage centerDiv">{errorResponse}</div>}
                <label className={isUser?'':'requiredLabel'}>User</label>
                <input className={isUser?'':'requiredField'} type="text" value={user} onChange={(e)=> setUser(e.target.value)}></input>
                
                <label className={isPass?'':'requiredLabel'}>Password</label>
                <input className={isPass?'':'requiredField'}  type="password" value={passwd} onChange={(e)=> setPasswd(e.target.value)}></input>
                <div className="centerDiv">
                    <button onClick={handleValidations}>Login</button>
                </div>
                

            </form>
        </DefaultLayout>
    );
}