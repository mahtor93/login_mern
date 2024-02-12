function isSecurePassword(pass:string):{alert:string[]; isSecure:boolean} {
    const msg : string[] = [];
    pass.length<8 ? msg.push('El password debe tener al menos 8 caracteres'):'';
    pass.match(/[A-Z]/) ? '' : msg.push('El password requiere al menos una mayuscula.');
    pass.match(/[0-9]/) ? '' : msg.push('El password requiere al menos un número.\n');
    pass.match(/[!"#$%&\/()=|@·~½¬{}?¡.\-_+*]/) ? '': msg.push('El password requiere al menos un caracter especial.')
    return {
        alert: msg,
        isSecure: msg.length===0?true:false,
    }
}

export { isSecurePassword }