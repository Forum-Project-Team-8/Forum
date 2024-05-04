import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
    apiKey: "AIzaSyDuKcI-sGy8otjxqoDc7hnOQ7JMmci7zQs",
    authDomain: "forum-project-aac22.firebaseapp.com",
    projectId: "forum-project-aac22",
    storageBucket: "forum-project-aac22.appspot.com",
    messagingSenderId: "207072058221",
    appId: "1:207072058221:web:7c19f26769e673c0469864",
    databaseURL: "https://forum-project-aac22-default-rtdb.europe-west1.firebasedatabase.app/",
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// the Firebase authentication handler
export const auth = getAuth(app);
// the Realtime Database handler
export const db = getDatabase(app);