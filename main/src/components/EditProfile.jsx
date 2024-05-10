import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { getUserData, updateUser } from "../services/user.service"; // You'll need to implement this function
import { Box, Button, FormControl, FormLabel, Input, Heading } from "@chakra-ui/react";
import { db, auth } from "../config/firebase-config";
import { ref, update, get } from 'firebase/database';
import { updatePassword } from 'firebase/auth';

export default function EditProfile() {
    const { user } = useContext(AppContext);
    const [firstname, setFirstName] = useState(user.firstName);
    const [lastname, setLastName] = useState(user.lastName);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.dir(user);
        getUserData(user.uid)
        .then(async snapshot => {
            console.log(snapshot.val());
            console.log(Object.keys(snapshot.val())[0])
            const userData = snapshot.val();
            console.log(userData)
            if (userData) {
                const handle = Object.keys(snapshot.val())[0];
                const userRef = ref(db, 'users/' + `${handle}`);
                await update(userRef, {
                    firstname: firstname || snapshot.val()[handle].firstname,
                    lastname: lastname || snapshot.val()[handle].lastname,
                    email: email || snapshot.val()[handle].email,
                    });

                    if (password) {
                        await updatePassword(auth.currentUser, password);
                    }

            } else {
                console.error('User does not exist');
            }
        })
        .catch(error => {
            console.error(error);
        });
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
                <Button type="submit">Save Changes</Button>
            </form>
        </Box>
    );
}