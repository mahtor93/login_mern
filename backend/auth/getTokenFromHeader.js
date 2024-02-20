function getTokenFromHeader(header){
    if(header && header.authorization){
        console.log(header);
        const parted = header.authorization.split(' ');
        if(parted.length===2){
            return parted[1];
        }else{
            return null;
        }
    }else{
        return null;
    }
}

export { getTokenFromHeader }