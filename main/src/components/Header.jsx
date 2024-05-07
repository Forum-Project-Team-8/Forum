import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { logoutUser } from "../services/auth.service";
import UsersList from "./UsersList";
export default function Header() {
    const { user, userData, setAppState } = useContext(AppContext);
    const [showContent, setShowContent] = useState(false); 
    const [showContentAdmin, setShowContentAdmin] = useState(false); 
    const navigate = useNavigate();
    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
        navigate('/');
    };

    return (
        <header>
            {userData && userData.isAdmin && (
                <button onClick={() => setShowContentAdmin(!showContentAdmin)}>Admin</button>
            )}
            {/* {(user && userData.isAdmin) && <button onClick={() => setShowContentAdmin(!showContentAdmin)}>Admin</button>} */}
            {showContentAdmin && ( 
                <>
                                            
                        <div>Show admin stuff</div>
                        <UsersList />

                    
                </>
            )}

            <button onClick={() => setShowContent(!showContent)}>User</button> 
            {showContent && ( // Render content based on showContent state
                <>
                    {user ? (
                        <>         
                           {/* { console.log(userData)} */}
                        {/* {console.log(userData.isAdmin)} */}
                        <NavLink to="/posts-create">Create post</NavLink>
                        <NavLink to="/posts">All posts</NavLink>
                        <button onClick={logout}>LogOut</button>
                        </>
                    ) : (
                        <><br />
                            <NavLink to="/login">Login</NavLink> <br />
                            <NavLink to="/register">Register</NavLink><br />
                        </>
                    )}
                </>
            )}
            <NavLink to="/">Home</NavLink>
        </header>
    );
}
