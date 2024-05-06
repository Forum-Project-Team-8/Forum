import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { logoutUser } from "../services/auth.service";
export default function Header() {
    const { user, userData, setAppState } = useContext(AppContext);
    const [showContent, setShowContent] = useState(false); // State to manage whether to show content or not
    const [showContentAdmin, setShowContentAdmin] = useState(false); // State to manage whether to show content or not

    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
    };

    return (
        <header>

            <button onClick={() => setShowContentAdmin(!showContentAdmin)}>Admin</button> {/* Toggle the showContent state */}
            {showContentAdmin && ( // Render content based on showContent state
                <>
                    {user ? (
                        <>
                        <NavLink to="/posts-create">Create tweet</NavLink>
                        <button onClick={logout}>LogOut</button>
                        </>
                    ) : (
                        <><br />
                            <NavLink to="/login">Login</NavLink> <br />
                            <NavLink to="/registerAdmin">Register Admin</NavLink> <br />
                        </>
                    )}
                </>
            )}

            <button onClick={() => setShowContent(!showContent)}>User</button> {/* Toggle the showContent state */}
            {showContent && ( // Render content based on showContent state
                <>
                    {user ? (
                        <>
                        <NavLink to="/posts-create">Create post</NavLink>
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
// export default function Header () {
//     const { user, userData, setAppState } = useContext(AppContext);

//     const logout = async() => {
//         await logoutUser();
//         setAppState({ user: null, userData: null})
//     };

//     return (
//         <header>
//             <button>Admin</button>
//             <button onClick=            { user 
//             ? (
//                return( <>
                    
//                     <button onClick={logout}>LogOut</button>
//                 </>);
//             )
//             : return (<>
//                 <NavLink to="/login">Login</NavLink>
//                 <NavLink to="/register">Register</NavLink>
//             </>)}>User</button>
//             <NavLink to="/">Home</NavLink>
    

//         </header>
//     )
// }
