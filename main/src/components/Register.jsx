
import { useContext, useState } from "react";
import { registerUser } from "../services/auth.service";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { createUserHandle, getUserByHandle } from "../services/user.service";
import { Box, Button, FormControl, FormLabel, Input, Heading } from "@chakra-ui/react";
import { m } from "framer-motion";

export default function Register() {

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
      <Button sx={buttonStyles} onClick={register}>Register</Button>
    </Box>
  );
}