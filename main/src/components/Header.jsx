

    import { NavLink, useNavigate } from "react-router-dom";
    import { useContext, useState } from "react";
    import { AppContext } from "../context/AppContext";
    import { logoutUser } from "../services/auth.service";
    import { Button, Flex, Spacer, background, border } from "@chakra-ui/react";
    import AdminPanel from "./AdminPanel";
    import { Box } from "@chakra-ui/react";
    import { m } from "framer-motion";



const spacerStyle = {
    m: 0.2,
};

const buttonStyle4 = {
    color: '#403072',
    background: 'lightblue',
           textShadow: '2px 2px 4px #579cbc',
    fontSize: '2xl',
    fontWeight: 'bold',
    textAlign: 'center',
    p: 2,
    borderRadius: 'md',
    filter: 'drop-shadow(0 0 0.75rem #feff27)',
    m: 2,
};

const buttonStyle = {
    border: '2px solid #2d626a',
    padding: '10px',
    display: 'inline-block',
    color: '#d17e7f',
    textShadow: '2px 2px 4px #f2f299',
    fontSize: '2xl',
    fontWeight: 'bold',
    textAlign: 'center',
    p: 2,
    borderRadius: 'md',
    filter: 'drop-shadow(0 0 0.75rem #c8e29d)',
    m: 2,
};

const buttonStyle2 = {
    border: '2px solid #2d626a',
    padding: '10px',
    display: 'inline-block',
    color: '#2d626a',   
    textShadow: '2px 2px 4px #579cbc',
    fontSize: '2xl',
    textAlign: 'center',
    p: 2,
    borderRadius: 'md',
    filter: 'drop-shadow(0 0 0.75rem #feff27)',
    m: 2,
};
const buttonStyle3 = {
    border: '2px solid #2d626a',
    padding: '10px',
    display: 'inline-block',
    color: '#2d626a',
    textShadow: '2px 2px 4px #579cbc',
    fontSize: '2xl',
    fontWeight: 'bold',
    textAlign: 'center',
    p: 2,
    borderRadius: 'md',
    filter: 'drop-shadow(0 0 0.75rem #feff27)',
    m: 2,
};

const buttonStyle5 = {
    border: '2px solid #c2787a',
    padding: '10px',
background:"#f4cccc" ,
    display: 'inline-block',
    color: '#f44336',
    textShadow: '2px 2px 4px #579cbc',
    fontSize: '2xl',
    fontWeight: 'bold',
    textAlign: 'center',
    p: 2,
    borderRadius: 'md',
    filter: 'drop-shadow(0 0 0.75rem #feff27)',
    m: 2,

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
            <Button sx={buttonStyle5} as={NavLink} to="/admin-panel" variant="link">Admin</Button>
            )}

            <Button sx={buttonStyle4} onClick={() => setShowContent(!showContent)}>User</Button> 
            {showContent && ( 
            <>
            {user ? (
            <>         
            <Box>
            <Button sx={buttonStyle2} as={NavLink} to="/posts-create" variant="link">Create post</Button>
            <Button sx={buttonStyle2} as={NavLink} to="/posts" variant="link">All posts</Button>
            <Button sx={buttonStyle2} as={NavLink} to="/edit-profile" variant="link">Edit Profile</Button>
            <Button sx={buttonStyle2} onClick={logout} variant="link">LogOut</Button>
            </Box>
            </>
            ) : (
            <>
            <Button sx={buttonStyle2} as={NavLink} to="/login" variant="link">Login</Button>
            <Spacer sx={spacerStyle} />
            <Button sx={buttonStyle2} as={NavLink} to="/register" variant="link">Register</Button>
            </>
            )}
            </>
            )}
            <Spacer />
            <Button sx={buttonStyle} as={NavLink} to="/" variant="link">Home</Button>
            </Flex>
        );
    }

