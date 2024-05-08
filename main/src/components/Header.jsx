

import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { logoutUser } from "../services/auth.service";
import UsersList from "./UsersList";
import { Button } from "@chakra-ui/react";

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
                <Button onClick={() => setShowContentAdmin(!showContentAdmin)}>Admin</Button>
            )}
            {/* {(user && userData.isAdmin) && <Button onClick={() => setShowContentAdmin(!showContentAdmin)}>Admin</Button>} */}
            {showContentAdmin && ( 
                <>
                                            
                        <div>Show admin stuff</div>
                        <UsersList />

                    
                </>
            )}

            <Button onClick={() => setShowContent(!showContent)}>User</Button> 
            {showContent && ( // Render content based on showContent state
                <>
                    {user ? (
                        <>         
                           {/* { console.log(userData)} */}
                        {/* {console.log(userData.isAdmin)} */}
                        <NavLink to="/posts-create">Create post</NavLink>
                        <NavLink to="/posts">All posts</NavLink>
                        <Button onClick={logout}>LogOut</Button>
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
