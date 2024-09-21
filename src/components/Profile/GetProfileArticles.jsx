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
      orderBy("date", "desc")
    );
    getDocs(q)
      .then((querySnapshot) => {
        setArticles(querySnapshot);
      })
      .catch((error) => {
        console.log(error);
      });

    setLoading(false);
  }, [location.pathname]);

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
        articles?.docs?.slice(0, page).map((article) => {
          return (
            <>
              {/* <Link to={draft ? '/write/' + article.id : '/article/' + article.id}>
            <div key={article.id}>
                <div className='w-full  min-h-[250px] flex cursor-pointer'>
                <div className='w-2/3 flex flex-col justify-between items-start py-6'>
                    
                    <h1 className='text-3xl font-bold'>{article.data().title || 'Untitled'}</h1>
                    <p className='text-md color-gray'>{article.data().description || 'No Description'}</p>
                    <p>{article.data().date.toDate().toLocaleDateString("en-us", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className='w-1/3 flex items-center justify-end'>
                <img src={article.data().cover || 'https://images.unsplash.com/photo-1719937206168-f4c829152b91?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} alt=""
                className='w-[250px] h-[150px] object-cover'
                />
                </div>
                    
                </div>
            </div>
            </Link> */}

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

      {page < articles?.docs?.length && (
        <div
          onClick={() => setPage(page + 10)}
          className="btn cursor-pointer my-10 max-w-[8rem]"
        >
          Load More
        </div>
      )}
    </>
  );
};

export default GetProfileArticles;
