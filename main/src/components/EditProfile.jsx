import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Box, Button, FormControl, FormLabel, Input, Heading, Text } from "@chakra-ui/react";
import FileUpload from "./FileUpload";
import { updateUserData } from "../services/user.service";
import { getUserData } from "../services/user.service";

export default function EditProfile() {
    const { user } = useContext(AppContext);
    const [firstname, setFirstName] = useState(user.firstName);
    const [lastname, setLastName] = useState(user.lastName);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [photoData, setPhotoData] = useState(null);

    const validateForm = () => {
        if (
            firstname.length < 4 ||
            firstname.length > 32 ||
            lastname.length < 4 ||
            lastname.length > 32
        ) {
            setErrorMessage("First and last names must be between 4 and 32 characters.");
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrorMessage("Please enter a valid email address.");
            return false;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return false;
        }

        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters long.");
            return false;
        }

        if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
            setErrorMessage("Password must contain both uppercase and lowercase letters.");
            return false;
        }

        setErrorMessage('');
        return true;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        async function handleUpdateUserData() {
            try {
              const snapshot = await getUserData(user.uid);
              const result = await updateUserData(snapshot, firstname, lastname, email, photoData, password);
              if (!result.success) {
                setErrorMessage(result.message);
              }
            } catch (error) {
              console.error(error);
              setErrorMessage('An error occurred. Please try again later.');
            }
          }
          
          handleUpdateUserData();

        }

    const handleUpload = (dataURL) => {
        setPhotoData(dataURL.split(',')[1]); 
    };

    return (
        <Box>
            <Heading>Edit Profile</Heading>
            <form onSubmit={handleSubmit}>
                <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <Input value={firstname} onChange={(e) => setFirstName(e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <Input value={lastname} onChange={(e) => setLastName(e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel>Photo</FormLabel>
                    <FileUpload onUpload={handleUpload} />
                </FormControl>
                {errorMessage && <Text color="red">{errorMessage}</Text>}
                <Button type="submit">Save Changes</Button>
            </form>
        </Box>
    );
}
