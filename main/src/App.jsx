import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Header from './components/Header';
import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContext } from './context/AppContext.jsx';
import { getUserData } from './services/user.service.js';
import {useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config.js';
import CreatePost from './components/CreatePost.jsx';
import AllPosts from './components/AllPosts.jsx';
import SinglePost from './components/SinglePost.jsx';
import EditProfile from './components/EditProfile.jsx';

  
  function App() {
    const [appState, setAppState] = useState({
      user: null,
      userData: null,
    });
    const [user, loading, error] = useAuthState(auth);
  
    if (user && appState.user !== user) {
      setAppState({ ...appState, user });
    }

    useEffect(() => {
      if (!appState.user) return;
      console.log("User UID:", appState.user.uid);

      getUserData(appState.user.uid)
        .then(snapshot => {
          if (snapshot && snapshot.val()) { 
            setAppState({...appState, userData:Object.values(snapshot.val())[0]});
          } else {
            // Handle case where snapshot is null or undefined
            console.error("Snapshot is null or undefined.");
          }

         
              
        })
        .catch(error => {
          // Handle error
          console.error("Error fetching user data:", error);
        });
    }, [appState.user]);

    useEffect(() => {
      console.log("Updated userData:", appState.userData);
    }, [appState.userData]);
  

  return (
    <>
      <BrowserRouter>
        <AppContext.Provider value={{...appState, setAppState}}>
          <Header />
            <Routes>
              <Route path="/login" element={<Login />}/>
              <Route path="/register" element={<Register />}/>
              <Route path="/" element={<Home />}/>
              <Route path="/posts-create" element={<CreatePost/>}/>
              <Route path="/posts" element={<AllPosts/>}/>  
              <Route path="/posts/:id" element={<SinglePost/>}/>
              <Route path="/edit-profile" element={<EditProfile/>}/>       
              <Route path="*" element={<header>Not Found</header>}/>
     
            </Routes>
            </AppContext.Provider>
      </BrowserRouter>

    </>
  )
}

export default App
