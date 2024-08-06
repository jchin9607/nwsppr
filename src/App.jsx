import React from 'react'
import { BrowserRouter, Router, Route, Link, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import {Navbar} from './components/Navbar.jsx'
import Auth from './pages/Auth.jsx'
import Profile from './pages/Profile.jsx'
import Write from './pages/Write.jsx'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase/firebase.js'
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from './firebase/firebase.js'
import Drafts from './pages/Drafts.jsx'
import { useState } from 'react'
import Article from './pages/Article.jsx'
import { v4 as uuidv4 } from 'uuid';
import Search from './pages/Search.jsx'
import Fourohfour from './pages/Fourohfour.jsx'
import Footer from './pages/Footer.jsx'
const App = () => {
  
  const [user, loading, error] = useAuthState(auth)
  
  
  // checking if new user or not, put it here because it reads data once every render
  
  
  if (user) {
    
    
    localStorage.clear();
    const docRef = doc(db, "users", user.uid);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
       localStorage.setItem("user", JSON.stringify(docSnap.data()))
       
        
      } else {
        const data = {
          fullName: user.displayName,
          email: user.email,
          username: user.email.split('@')[0] + uuidv4().split('-')[0],
          photoURL: user.photoURL,
          uid: user.uid,
          followers: [],
          following: [],
          articles: [],
          bio: "",
          bannerURL: "",
          verified: false,
        }
        setDoc(docRef, data);
        localStorage.setItem("user", JSON.stringify(data))
       
        
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  }
  


  
  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <>
    <Navbar loggedIn={user}/>
    <div>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />}/>
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
        <Route path="/p/:user" element={user? <Profile /> : <Navigate to="/auth" />}/>
        <Route path="/write/" element={user ? <Write/> : <Navigate to="/auth" />}/>
        <Route path="/write/:document" element={user ? <Write /> : <Navigate to="/auth" />}/>
        <Route path="/drafts" element={user ? <Drafts /> : <Navigate to="/auth" />}/>
        <Route path="/article/:articleId" element={<Article />}/>
        <Route path="/search/:type/:value" element={user ? <Search /> : <Navigate to="/auth" />}/>
        <Route path="/404" element={<Fourohfour />}/>
        <Route path="*" element={<Navigate to="/404" />}/>
      </Routes>
    </div>
    <Footer />
    </>
  )
}

export default App