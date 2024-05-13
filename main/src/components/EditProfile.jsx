import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { getUserData, updateUser } from "../services/user.service";
import { Box, Button, FormControl, FormLabel, Input, Heading, Text } from "@chakra-ui/react";
import { db, auth } from "../config/firebase-config";
import { ref, update } from 'firebase/database';
import { updatePassword } from 'firebase/auth';
import FileUpload from "./FileUpload";

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

        getUserData(user.uid)
            .then(async snapshot => {
                const userData = snapshot.val();
                if (userData) {
                    const handle = Object.keys(snapshot.val())[0];
                    const userRef = ref(db, 'users/' + `${handle}`);
                    await update(userRef, {
                        firstname: firstname || snapshot.val()[handle].firstname,
                        lastname: lastname || snapshot.val()[handle].lastname,
                        email: email || snapshot.val()[handle].email,
                        photoData: photoData || snapshot.val()[handle].photoData, // Update photo data
                    });

                    if (password) {
                        await updatePassword(auth.currentUser, password);
                    }

                } else {
                    setErrorMessage('User does not exist');
                }
            })
            .catch(error => {
                console.error(error);
                setErrorMessage('An error occurred. Please try again later.');
            });
    };
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (!validateForm()) {
    //         return;
    //     }

    //     getUserData(user.uid)
    //         .then(async snapshot => {
    //             console.log(snapshot.val());
    //             console.log(Object.keys(snapshot.val())[0])
    //             const userData = snapshot.val();
    //             console.log(userData)
    //             if (userData) {
    //                 const handle = Object.keys(snapshot.val())[0];
    //                 const userRef = ref(db, 'users/' + `${handle}`);
    //                 await update(userRef, {
    //                     firstname: firstname || snapshot.val()[handle].firstname,
    //                     lastname: lastname || snapshot.val()[handle].lastname,
    //                     email: email || snapshot.val()[handle].email,
    //                 });

    //                 if (password) {
    //                     await updatePassword(auth.currentUser, password);
    //                 }

    //             } else {
    //                 setErrorMessage('User does not exist');
    //             }
    //         })
    //         .catch(error => {
    //             console.error(error);
    //             setErrorMessage('An error occurred. Please try again later.');
    //         });
    // };
    const handleUpload = (dataURL) => {
        setPhotoData(dataURL.split(',')[1]); // Extract base64 data from dataURL
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
