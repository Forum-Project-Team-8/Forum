
import { useContext, useState } from "react";
import { registerUser } from "../services/auth.service";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { createUserHandle, getUserByHandle } from "../services/user.service";
import { Box, Button, FormControl, FormLabel, Input, Heading, Spacer } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";


export default function Register() {

  const boxStyles = {
    bg: '	#a9bdb9',
    color: 'black',
    fontWeight: 'bold',
    p: 4,
    borderRadius: 'md',
    width: '400px',
    margin: '0 auto', 
    filter: 'drop-shadow(0 0 0.75rem #333)',
    ':hover': {
      bg: '#dbebe8',
      color: 'black',
    },
  };
  const spacerStyle = {
    h: '20px',
};

  const buttonStyles = { 
    color: 'black',
    bg: 'yellow.200',
    fontWeight: 'bold',
    m: 2,
    p: 1,
    borderRadius: 'md',
    filter: 'drop-shadow(0 0 0.75rem #333)',
    ':hover': {
      bg: 'tomato',
      color: 'white',
    },
  };

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { user, setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  if (user) {
    navigate("/");
  }

  const updateForm = (prop) => (e) => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };
  const validateForm = () => {
    if (
      form.firstname.length < 4 ||
      form.firstname.length > 32 ||
      form.lastname.length < 4 ||
      form.lastname.length > 32
    ) {
      alert("First and last names must be between 4 and 32 characters.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert("Please enter a valid email address.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return false;
    }
    if (form.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return false;
    }
  
    if (!/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password)) {
      alert("Password must contain both uppercase and lowercase letters.");
      return false;
    }

    return true;
  };

  const register = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const user = await getUserByHandle(form.username);
      user.isAdmin = form.isAdmin;
      if (user.exists()) {
        return console.log("User with this username already exists!");
      }
      const credential = await registerUser(form.email, form.password);
      await createUserHandle(
        form.firstname,
        form.lastname,
        form.username,
        credential.user.uid,
        credential.user.email
      );
      setAppState({ user: credential.user, userData: null });

      navigate("/");
      alert("Registered!");
    } catch (error) {
      if (error.message.includes("auth/email-already-in-use")) {
        console.log("User has already been registered!");
      }
    }
  };

  return (

<div>

    <Box sx={boxStyles}>
      <Heading>Register</Heading>
      <FormControl>
        <FormLabel htmlFor="firstname">First name:</FormLabel>
        <Input
          value={form.firstname}
          onChange={updateForm("firstname")}
          type="text"
          name="firstname"
          id="firstname"
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="lastname">Last name:</FormLabel>
        <Input
          value={form.lastname}
          onChange={updateForm("lastname")}
          type="text"
          name="lastname"
          id="lastname"
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="username">Username:</FormLabel>
        <Input
          value={form.username}
          onChange={updateForm("username")}
          type="text"
          name="username"
          id="username"
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="email">Email:</FormLabel>
        <Input
          value={form.email}
          onChange={updateForm("email")}
          type="text"
          name="email"
          id="email"
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="password">Password:</FormLabel>
        <Input
          value={form.password}
          onChange={updateForm("password")}
          type="password"
          name="password"
          id="password"
        />
      </FormControl>
      <FormControl>
          <FormLabel htmlFor="confirmPassword">Confirm Password:</FormLabel>
          <Input
            value={form.confirmPassword}
            onChange={updateForm("confirmPassword")}
            type="password"
            name="confirmPassword"
            id="confirmPassword"
          />
        </FormControl>
      <Button sx={buttonStyles} onClick={register}>Register</Button>
    </Box>
    <Spacer sx={spacerStyle}/>
    <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4}>
       
       <Image boxSize='500px' src='https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='Second Image' sx={{ borderRadius: 'full', border: '4px solid #cededb', filter: 'drop-shadow(0 0 0.75rem #D4B590)' }} />
       <Image boxSize='500px' src='https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='Travel' sx={{ borderRadius: 'full', border: '4px solid #cededb', filter: 'drop-shadow(0 0 0.75rem #D4B590)' }} />
       <Image boxSize='500px' src='https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1226&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='Second Image' sx={{ borderRadius: 'full', border: '4px solid #cededb', filter: 'drop-shadow(0 0 0.75rem #D4B590)' }} />
     </Box>
    </div>
  );
}