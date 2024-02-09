import { Link } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider";

interface DefaultLayoutProps{
    children: React.ReactNode;
}



export default function DefaultLayout({children}:DefaultLayoutProps){
    const auth = useAuth();

    return(
        <>
            <header>
                <nav>
                    <ul>
                        <li>
                            <Link to='/'>
                                Home
                            </Link>
                        </li>
                        {auth.isAuth?
                        <li>
                            <Link to='/dashboard'>
                                Dashboard
                            </Link>
                        </li>:<></>}
                        {auth.isAuth?<></>:
                            <li>
                                <Link to='/login'>
                                    Login
                                </Link>
                            </li>
                        }
                        {auth.isAuth?<></>:
                            <li>
                                <Link to='/register'>
                                    Register
                                </Link>
                            </li>
                        }
                        {auth.isAuth?<li id="Auth" className="navbarActive"><Link to='/login'>Logout</Link></li>:<></>}
                    </ul>
                </nav>
            </header>
            <main>
                {children}
            </main>
        </>
    )
}