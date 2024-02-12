import DefaultLayout from "../layout/DefaultLayout";
import { useState } from 'react';
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";
import { AuthResponseError } from "../types/types";
import { Navigate, useNavigate } from "react-router-dom";
import { isSecurePassword } from '../utils/password.ts';

export default function Register() {
    const [user, setUser] = useState('');
    const [mail, setMail] = useState('');
    const [errorResponse,setErrorResponse] = useState('');
    const [passwd, setPasswd] = useState('');
    const [isUser, setIsUser] = useState(true);
    const [isMail, setIsMail] = useState(true);
    const [isPass, setIsPass] = useState(true);
    const [evaluatePass, setEvaluatePass] = useState(false);
    const auth = useAuth();
    const goTo = useNavigate();


    const timestamp = Date.now();
    async function handleRegisterForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();         
        if(!isSecurePassword(passwd).isSecure){
            setEvaluatePass(true);
        }
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user,
                    mail,
                    passwd
                })
            });
            if(response.ok){
                console.log('User Created Successfully',timestamp);
                setErrorResponse('');
                goTo('/login');
            }else{
                console.log('Something went wrong',timestamp)
                const json = (await response.json()) as AuthResponseError;
                setErrorResponse(json.body.error);
            }
        } catch (error) {
            console.error('Error en handleRegisterForm:',error,timestamp);
        }
    }

    if (auth.isAuth) {
        return <Navigate to='/dashboard'></Navigate>
    }

    function handleValidations(){
        user?setIsUser(true):setIsUser(false);
        mail?setIsMail(true):setIsMail(false);
        passwd?setIsPass(true):setIsPass(false);
        
    }

    function renderErrors(errors:string[]): JSX.Element[]{
        return errors.map((error,index)=>(
            <p key={index}>{error}</p>
        ));
    }

    return (
        <DefaultLayout>
            <form className="form" onSubmit={handleRegisterForm}>
                <h1>Register</h1>
                
                <label className={isUser?'':'requiredLabel'}>User</label>
                <input className={isUser?'':'requiredField'} type="text" value={user} onChange={(e) => setUser(e.target.value)}></input>

                <label className={isMail?'':'requiredLabel'}>Mail</label>
                <input className={isMail?'':'requiredField'} type="email" value={mail} onChange={(e) => setMail(e.target.value)}></input>

                <label className={isPass?'':'requiredLabel'}>Password</label>
                <input className={isPass?'':'requiredField'} type="password" value={passwd} onChange={(e) => setPasswd(e.target.value)}></input>
                {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
                {evaluatePass && <div className="errorMessage">{renderErrors(isSecurePassword(passwd).alert)}</div>}
                <div className="centerDiv">
                    <button onClick={handleValidations}>Register</button>
                </div>
                
            </form>
        </DefaultLayout>
    );
}