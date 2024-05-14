

    import { NavLink, useNavigate } from "react-router-dom";
    import { useContext, useState } from "react";
    import { AppContext } from "../context/AppContext";
    import { logoutUser } from "../services/auth.service";
    import { Button, Flex, Spacer } from "@chakra-ui/react";
    import AdminPanel from "./AdminPanel";
    import { Box } from "@chakra-ui/react";
    import { m } from "framer-motion";


const spacerStyle = {
    m: 0.2,
};

    export default function Header() {
        const { user, userData, setAppState } = useContext(AppContext);
        const [showContent, setShowContent] = useState(false); 
        const navigate = useNavigate();
        const logout = async () => {
            await logoutUser();
            setAppState({ user: null, userData: null });
            navigate('/');
        };

        return (
            <Flex as="nav" align="center" justify="space-between">
                {userData && userData.isAdmin && (
                    <NavLink to="/admin-panel" as={Button} variant="link">Admin</NavLink>
                )}

                <Button onClick={() => setShowContent(!showContent)}>User</Button> 
                {showContent && ( 
                    <>
                        {user ? (
                            <>         
                                <NavLink to="/posts-create" as={Button} variant="link">Create post</NavLink>
                                <NavLink to="/posts" as={Button} variant="link">All posts</NavLink>
                                <NavLink to="/edit-profile" as={Button} variant="link">Edit Profile</NavLink>
                                <Button onClick={logout} variant="link">LogOut</Button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" as={Button} variant="link">Login</NavLink>
                                <Spacer sx={spacerStyle} />
                                <NavLink to="/register" as={Button} variant="link">Register</NavLink>
                            </>
                        )}
                    </>
                )}
                <Spacer />
                <NavLink to="/" as={Button} variant="link">Home</NavLink>
            </Flex>
        );
    }

