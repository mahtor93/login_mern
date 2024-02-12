export interface AuthResponse{
    body:{
        user: UserActivation;
        accessToken: string;
        refreshToken: string;
    };
}
export interface AuthResponseError{
    body:{
        error:string;
    };
}

export interface User{
    _id: string;
    user: string;
    mail: string;
    role:string;
}

declare module '../utils/password.js'{
    export function isSecurePassword(pass: string):{ alert:string; isSecure:boolean};
}