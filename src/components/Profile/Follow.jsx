import React from "react";
import {
  doc,
  setDoc,
  arrayUnion,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ArticleAuthor from "../../article/ArticleAuthor";

const Follow = ({ user, data, userId }) => {
  // const ownData = JSON.parse(localStorage.getItem("user"));
  const [follow, setFollow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(data.followers.length);
  const [openedModel, setOpenedModel] = useState(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data.followers.includes(userId)) {
      setFollow(true);
    }
    setAmount(data.followers.length);
    setLoading(false);
  }, [data, user]);
  function handleFollow() {
    setLoading(true);
    updateDoc(doc(db, "users", user), {
      followers: arrayUnion(userId),
    }).then(() => {
      // localStorage.setItem(
      //   user,
      //   JSON.stringify({
      //     ...cacheRef,
      //     followers: cacheRef.followers.concat(userId),
      //   })
      // );

      updateDoc(doc(db, "users", userId), {
        following: arrayUnion(user),
      }).then(() => {
        // localStorage.setItem(
        //   "user",
        //   JSON.stringify({
        //     ...ownData,
        //     following: ownData.following.concat(user),
        //   })
        // );
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["users", userId] });
        setFollow(true);
        setAmount(amount + 1);
        setLoading(false);
        // window.location.reload()
      });
    });
  }

  function handleUnfollow() {
    setLoading(true);
    updateDoc(doc(db, "users", user), {
      followers: arrayRemove(userId),
    }).then(() => {
      // localStorage.setItem(
      //   user,
      //   JSON.stringify({
      //     ...data,
      //     followers: data.followers.filter((f) => f !== userId),
      //   })
      // );

      updateDoc(doc(db, "users", userId), {
        following: arrayRemove(user),
      }).then(() => {
        // localStorage.setItem(
        //   "user",
        //   JSON.stringify({
        //     ...ownData,
        //     following: ownData.following.filter((f) => f !== user),
        //   })
        // );
        queryClient.invalidateQueries({ queryKey: ["users", user] });
        queryClient.invalidateQueries({ queryKey: ["users", userId] });
        setFollow(false);
        setAmount(amount - 1);
        setLoading(false);
        // window.location.reload()
      });
    });
  }

  if (loading) {
    return <button>Loading...</button>;
  }

  if (!follow) {
    return (
      <div className="flex gap-4 items-center">
        <p>
          <strong>{amount}</strong> Followers
        </p>
        <p>
          <strong>{data.following.length}</strong> Following
        </p>
        <button onClick={handleFollow}>Follow</button>
      </div>
    );
  } else {
    return (
      <div className="flex gap-4 items-center">
        <p>
          <strong
            className="underline cursor-pointer"
            onClick={() => {
              document.getElementById("showFollowers").showModal();
              setOpenedModel(1);
            }}
          >
            {amount}
          </strong>{" "}
          Followers
        </p>
        <p>
          <strong
            className="underline cursor-pointer"
            onClick={() => {
              document.getElementById("showFollowers").showModal();
              setOpenedModel(2);
            }}
          >
            {data.following.length}
          </strong>{" "}
          Following
        </p>

        <button onClick={handleUnfollow}>Unfollow</button>

        <dialog id="showFollowers" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">
              {openedModel === 1 ? "Followers" : "Following"}
            </h3>
            <p className="py-4 max-h-[300px] overflow-y-auto">
              {openedModel === 1 &&
                data.followers.map((follower) => {
                  return (
                    <ArticleAuthor
                      key={follower}
                      useruid={follower}
                      inArticle={false}
                      inComment={false}
                    />
                  );
                })}
              {openedModel === 2 &&
                data.following.map((following) => {
                  return (
                    <ArticleAuthor
                      key={following}
                      useruid={following}
                      inArticle={false}
                      inComment={false}
                    />
                  );
                })}
            </p>
          </div>
        </dialog>
      </div>
    );
  }
};

export default Follow;
