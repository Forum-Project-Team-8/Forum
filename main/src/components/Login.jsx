

import { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { loginUser } from "../services/auth.service";
import { Box, Button, FormControl, FormLabel, Input, Heading } from "@chakra-ui/react";

export default function Login() {

  const boxStyles = {
    bg: 'tomato',
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