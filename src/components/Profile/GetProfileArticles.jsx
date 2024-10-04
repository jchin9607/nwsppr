import React from "react";
import { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  limit,
  startAfter,
} from "firebase/firestore";
import { deleteObject, ref, listAll } from "firebase/storage";
import { storage } from "../../firebase/firebase";
import Loading from "../Loading";
import SuggestedPost from "../SuggestedPost";

const GetProfileArticles = ({ user, draft, userId }) => {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(10);

  function handleDelete(id) {
    const folder = "images/" + id + "/";
    setLoading(true);
    setArticles((prevArticles) => {
      const filteredArticles = prevArticles?.docs?.filter(
        (doc) => doc.id !== id
      );
      return { docs: filteredArticles };
    });
    deleteDoc(doc(db, "articles", id))
      .then(() => {
        listAll(ref(storage, folder)).then((res) => {
          res.items.forEach((itemRef) => {
            deleteObject(ref(storage, folder + itemRef.name))
              .then(() => {
                console.log("image deleted");
              })
              .catch((error) => {
                console.log(error);
              })
              .finally(() => {
                setLoading(false);
              });
          });
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    const q = query(
      collection(db, "articles"),
      where("author", "==", user),
      where("draft", "==", draft),
      orderBy("date", "desc"),
      limit(10)
    );
    getDocs(q)
      .then((querySnapshot) => {
        setArticles({ docs: [...querySnapshot.docs] });
      })
      .catch((error) => {
        console.log(error);
      });

    setLoading(false);
  }, [location.pathname]);

  function loadMore() {
    const q = query(
      collection(db, "articles"),
      where("author", "==", user),
      where("draft", "==", draft),
      orderBy("date", "desc"),
      startAfter(articles.docs[articles.docs.length - 1]),
      limit(10)
    );
    getDocs(q)
      .then((querySnapshot) => {
        console.log({ docs: [...articles.docs, ...querySnapshot.docs] });
        setArticles({ docs: [...articles.docs, ...querySnapshot.docs] });
        setPage(page + 10);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (loading) {
    return <Loading />;
  }

  if (!articles) {
    return <p>No Articles</p>;
  }

  return (
    <>
      {!loading && articles.length === 0 && (
        <>
          <Loading />
          <Loading />
          <Loading />
        </>
      )}
      {!loading &&
        articles &&
        articles?.docs?.map((article) => {
          return (
            <>
              <SuggestedPost
                article={article.id}
                articleData={article.data()}
                draft={draft}
                key={article.id}
                userId={userId}
              />

              {draft && (
                <button
                  onClick={() => handleDelete(article.id)}
                  className="text-red-500 max-w-[100px]"
                >
                  Delete
                </button>
              )}
            </>
          );
        })}

      {page <= articles?.docs?.length && (
        <div
          onClick={() => loadMore()}
          className="btn cursor-pointer my-10 max-w-[8rem]"
        >
          Load More
        </div>
      )}
    </>
  );
};

export default GetProfileArticles;
