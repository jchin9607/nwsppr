import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { Navbar } from "./components/Navbar.jsx";
import Auth from "./pages/Auth.jsx";
import Profile from "./pages/Profile.jsx";
import Write from "./pages/Write.jsx";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase/firebase.js";
import Drafts from "./pages/Drafts.jsx";
import Article from "./pages/Article.jsx";
import { v4 as uuidv4 } from "uuid";
import Search from "./pages/Search.jsx";
import Fourohfour from "./pages/Fourohfour.jsx";
import Footer from "./pages/Footer.jsx";
import OurTeam from "./pages/OurTeam.jsx";
import Settings from "./pages/Settings.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 10,
      },
    },
  });

  // checking if new user or not, put it here because it reads data once every render
  if (user) {
    const filterList = JSON.parse(localStorage.getItem("filterList"));
    const lastCacheRefresh = parseInt(localStorage.getItem("lastCacheRefresh"));
    const now = Math.floor(Date.now() / 1000);
    if (now - lastCacheRefresh > 60 || !lastCacheRefresh) {
      localStorage.clear();
      localStorage.setItem("lastCacheRefresh", now);
    }
    localStorage.setItem("filterList", JSON.stringify(filterList));
    const docRef = doc(db, "users", user.uid);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = {
            ...docSnap.data(),
            email: null,
          };
          // localStorage.setItem("user", JSON.stringify(data));
        } else {
          const data = {
            fullName: user.displayName,
            username: user.email.split("@")[0] + uuidv4().split("-")[0],
            photoURL: user.photoURL,
            uid: user.uid,
            followers: [],
            following: [],
            articles: [],
            bio: "",
            bannerURL: "",
            verified: false,
          };
          setDoc(docRef, data);
          // localStorage.setItem("user", JSON.stringify(data));
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Navbar loggedIn={user} />
        <div>
          <Routes>
            <Route
              path="/home"
              element={user ? <Home userId={user.uid} /> : <Navigate to="/" />}
            />
            <Route
              path="/"
              element={!user ? <Auth /> : <Navigate to="/home" />}
            />
            <Route
              path="/p/:user"
              element={
                user ? <Profile userId={user.uid} /> : <Navigate to="/" />
              }
            />
            <Route
              path="/write/"
              element={user ? <Write userId={user.uid} /> : <Navigate to="/" />}
            />
            <Route
              path="/write/:document"
              element={user ? <Write userId={user.uid} /> : <Navigate to="/" />}
            />
            <Route
              path="/drafts"
              element={
                user ? <Drafts userId={user.uid} /> : <Navigate to="/" />
              }
            />
            <Route
              path="/article/:articleId"
              element={<Article loggedIn={user?.uid} />}
            />
            <Route
              path="/search/:type/:value"
              element={user ? <Search /> : <Navigate to="/" />}
            />
            <Route path="/404" element={<Fourohfour />} />
            <Route path="/team" element={<OurTeam />} />
            <Route
              path="/settings"
              element={
                user ? <Settings userId={user.uid} /> : <Navigate to="/" />
              }
            />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </div>
        <Footer />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
};

export default App;
