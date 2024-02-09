import { Link } from "react-router-dom";

export default function RouteError(){
    return(
        <div className="errorMessage">
            <h1>Woops!</h1>
            <p>Lo que estás buscando no existe o no tienes permiso para verlo ! ! !</p>
            <p>Volver al<Link to ='/'> Login</Link></p>
        </div>
    );
}