import { useContext, useState } from "react"
import { registerUser } from "../services/auth.service";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { createAdminHandle, getAdminByHandle } from "../services/admin.service";

export default function RegisterAdmin() {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
  });
  const { user, setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  if (user) {
    navigate('/');
  }

  const updateForm = prop => e => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };

  const register = async() => {
    // TODO: validate form data
    try {
      const user = await getAdminByHandle(form.username);
      if (user.exists()) {
        return console.log('Admin with this username already exists!');
      }
      const credential = await registerUser(form.email, form.password);
      await createAdminHandle( form.firstname, form.lastname, form.username, credential.user.uid, credential.user.email);
      setAppState({ user: credential.user, userData: null });
      navigate('/');
      alert('Registered!');
    } catch (error) {
      if (error.message.includes('auth/email-already-in-use')) {
        console.log('Admin has already been registered!');
      }
    }
  };

  return (<div>
    <h1>Register Admin</h1>
    <label htmlFor="firstname">First name:</label><input value={form.firstname} onChange={updateForm('firstname')} type="text" name="firstname" id="firstname" /><br/>
    <label htmlFor="lastname">Last name:</label><input value={form.lastname} onChange={updateForm('lastname')} type="text" name="lastname" id="lastname" /><br/>
    <label htmlFor="username">Username:</label><input value={form.username} onChange={updateForm('username')} type="text" name="username" id="username" /><br/>
    <label htmlFor="email">Email:</label><input value={form.email} onChange={updateForm('email')} type="text" name="email" id="email" /><br/>
    <label htmlFor="password">Password:</label><input value={form.password} onChange={updateForm('password')} type="password" name="password" id="password" /><br/><br/>
    <button onClick={register}>Register</button>
  </div>)
}