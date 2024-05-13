

import { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { loginUser } from "../services/auth.service";
import { Box, Button, FormControl, FormLabel, Input, Heading, Spacer } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";

export default function Login() {

  const boxStyles = {
    bg: '#D4B590',
    color: 'white',
    fontWeight: 'bold',
    p: 4,
    borderRadius: 'md',
    width: '400px',
    margin: '0 auto', 
    filter: 'drop-shadow(0 0 0.75rem #333)',
    ':hover': {
      bg: 'yellow.200',
      color: 'black',
    },
  };

    const buttonStyles = { 
    color: 'black',
    bg: 'yellow.200',
    fontWeight: 'bold',
    p: 2,
    borderRadius: 'md',
    filter: 'drop-shadow(0 0 0.75rem #333)',
    ':hover': {
      bg: 'tomato',
      color: 'white',
    },
    };
  const { user, setAppState } = useContext(AppContext);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      navigate(location.state?.from.pathname || '/');
    }
  }, [user]);

  const login = async() => {
    const { user } = await loginUser(form.email, form.password);
    setAppState({ user, userData: null });
    navigate(location.state?.from.pathname || '/');
    alert('Logged in');
  };

  const updateForm = prop => e => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
    };

  return (
    <div>
      <Box sx={boxStyles} >
        <Heading size="sm">Login</Heading>
        <FormControl>
          <FormLabel >Username</FormLabel>
          <Input type="text" name="username" />
          <FormLabel htmlFor="email">Email: </FormLabel>
          <Input value={form.email} onChange={updateForm('email')} type="text" name="email" id="email" />
          <FormLabel htmlFor="password">Password: </FormLabel>
          <Input value={form.password} onChange={updateForm('password')} type="password" name="password" id="password" /> <br /> <br /><br />
          <Button sx={buttonStyles} onClick={login}>Login</Button>
        </FormControl>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4}>
       
        <Image boxSize='500px' src='https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='Second Image' sx={{ borderRadius: 'full', border: '4px solid #D4B590', filter: 'drop-shadow(0 0 0.75rem #D4B590)' }} />
        <Image boxSize='500px' src='https://images.unsplash.com/photo-1534534573898-db5148bc8b0c?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='Travel' sx={{ borderRadius: 'full', border: '4px solid #D4B590', filter: 'drop-shadow(0 0 0.75rem #D4B590)' }} />
        <Image boxSize='500px' src='https://images.unsplash.com/photo-1498354178607-a79df2916198?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='Second Image' sx={{ borderRadius: 'full', border: '4px solid #D4B590', filter: 'drop-shadow(0 0 0.75rem #D4B590)' }} />
      </Box>
    </div>
  )
}



// export default function Login() {

//     return (
//         <div>
//             <h1>Login</h1>
//             <form>
//                 <label>Username</label>
//                 <input type="text" name="username" />
//                 <label htmlFor="email">Email: </label>
//                 <input  type="text" name="email" id="email" />
//                 <label htmlFor="password">Password: </label>
//                 <input  type="password" name="password" id="password" /> <br /> <br /><br />
                
//             </form>
//         </div>
//     )
// }