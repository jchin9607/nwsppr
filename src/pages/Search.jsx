import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebase.js";
import { getDocs, where, query } from "firebase/firestore";
import { collection } from "firebase/firestore";
import SuggestedPost from "../components/SuggestedPost.jsx";
import ArticleAuthor from "../article/ArticleAuthor.jsx";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen.jsx";
import { Helmet } from "react-helmet";

const Search = () => {
  const { type, value } = useParams();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (type === "articles") {
      const q = query(
        collection(db, type),
        where("title", ">=", value),
        where("title", "<=", value + "\uf8ff"),
        where("draft", "==", false)
      );
      getDocs(q)
        .then((querySnapshot) => {
          if (querySnapshot.size == 0) {
            navigate("/404");
            return;
          } else {
            setItems(querySnapshot);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (type === "users") {
      const q = query(
        collection(db, type),
        where("username", ">=", value),
        where("username", "<=", value + "\uf8ff")
      );
      getDocs(q)
        .then((querySnapshot) => {
          if (querySnapshot.size == 0) {
            navigate("/404");
            return;
          } else {
            setItems(querySnapshot);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      navigate("/404");
    }
  }, [type, value]);

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <div className="px-[5%] h-screen pt-[5%]">
      <Helmet>
        <title>Search | writeup.</title>
      </Helmet>
      {type === "users" &&
        items &&
        items.docs.map((item) => (
          <div>
            <ArticleAuthor useruid={item.data().uid} />
          </div>
        ))}
      {type === "articles" &&
        items &&
        items.docs.map((item) => (
          <SuggestedPost article={item.id} articleData={item.data()} />
        ))}
    </div>
  );
};

export default Search;
