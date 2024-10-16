import React from "react";
import { useState } from "react";
import {
  updateDoc,
  doc,
  arrayUnion,
  increment,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import Comment from "./Comment.jsx";
import Flag from "./Flag.jsx";
import ArticleAuthor from "./ArticleAuthor.jsx";

const Likes = ({ article, articleId, notClickable, userId }) => {
  const [likes, setLikes] = useState(article.likeCount || 0);
  const [liked, setLiked] = useState(article.likes.includes(userId));
  const [viewLikes, setViewLikes] = useState(false);
  function handleLike(increment, liked) {
    setLikes(parseInt(likes) + parseInt(increment));
    setLiked(liked);
  }

  function handleLikes() {
    if (notClickable) return;
    const docRef = doc(db, "articles", articleId);
    let articleList =
      JSON.parse(localStorage.getItem("articlesList"))?.docs || null;
    let articleListItem = articleList
      ? articleList.find((item) => item.id === articleId)
      : null;
    const index = articleList?.indexOf(articleListItem);

    if (liked) {
      updateDoc(docRef, {
        likes: arrayRemove(userId),
        likeCount: increment(-1),
      }).then(() => {
        handleLike(-1, false);
        localStorage.setItem(
          articleId,
          JSON.stringify({
            ...article,
            likes: article.likes.filter((author) => author !== userId),
            likeCount:
              JSON.parse(localStorage.getItem(articleId)).likeCount - 1,
          })
        );
        if (articleListItem) {
          articleListItem.likes = articleListItem.likes.filter(
            (author) => author !== userId
          );
          articleListItem.likeCount = articleListItem.likeCount - 1;
          articleList[index] = articleListItem;
          localStorage.setItem(
            "articlesList",
            JSON.stringify({ docs: articleList })
          );
        }
      });
    } else {
      updateDoc(docRef, {
        likes: arrayUnion(userId),
        likeCount: increment(1),
      }).then(() => {
        handleLike(1, true);
        const likeCount = JSON.parse(localStorage.getItem(articleId));
        localStorage.setItem(
          articleId,
          JSON.stringify({
            ...article,
            likes: likeCount.likes.concat(userId),
            likeCount: likeCount.likeCount + 1,
          })
        );
        if (articleListItem) {
          articleListItem.likes = articleListItem.likes.concat(userId);
          articleListItem.likeCount = articleListItem.likeCount + 1;
          articleList[index] = articleListItem;
          localStorage.setItem(
            "articlesList",
            JSON.stringify({ docs: articleList })
          );
        }
      });
    }
  }
  return (
    <div className="h-[50px] items-center w-full">
      <div className="rating gap-1 flex w-full h-full items-center">
        {!notClickable && liked && (
          <>
            <input
              type="radio"
              name="rating-3"
              className="mask mask-heart bg-red-400"
              onClick={handleLikes}
              aria-label="Unlike"
            />
          </>
        )}
        {!notClickable && !liked && (
          <input
            type="radio"
            name="rating-3"
            className="mask mask-heart bg-gray-400"
            onClick={handleLikes}
            aria-label="Like"
          />
        )}
        {notClickable &&
          JSON.parse(localStorage.getItem(articleId)).likes.includes(
            userId
          ) && (
            <>
              <input
                type="radio"
                name="rating-3"
                className="mask mask-heart bg-red-400"
                onClick={handleLikes}
                aria-label="Unlike"
              />
            </>
          )}
        {notClickable &&
          !JSON.parse(localStorage.getItem(articleId)).likes.includes(
            userId
          ) && (
            <input
              type="radio"
              name="rating-3"
              className="mask mask-heart bg-gray-400"
              onClick={handleLikes}
              aria-label="Like"
            />
          )}
        <p>
          {!notClickable ? (
            <span
              onClick={() => {
                document.getElementById("viewLikes").showModal();
                setViewLikes(true);
              }}
              className="cursor-pointer underline"
            >
              {likes}
            </span>
          ) : (
            JSON.parse(localStorage.getItem(articleId)).likeCount
          )}
        </p>

        <dialog id="viewLikes" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Likes</h3>
            <p className="py-4 max-h-[300px] overflow-y-auto">
              {viewLikes &&
                article.likes.map((author) => (
                  <ArticleAuthor
                    useruid={author}
                    key={author}
                    inArticle={false}
                    inComment={false}
                  />
                ))}
            </p>
          </div>
        </dialog>
        <Comment
          comments={article.comments}
          articleId={articleId}
          userId={userId}
        />
        {!notClickable && <Flag />}
      </div>
    </div>
  );
};

export default Likes;
