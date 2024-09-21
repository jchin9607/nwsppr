import React from "react";
import { doc, setDoc, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const Follow = ({ user, data, userId }) => {
  // const ownData = JSON.parse(localStorage.getItem("user"));
  const [follow, setFollow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(data.followers.length);

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
      const cacheRef = JSON.parse(localStorage.getItem(user));
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
      followers: data.followers.filter((f) => f !== userId),
    }).then(() => {
      // localStorage.setItem(
      //   user,
      //   JSON.stringify({
      //     ...data,
      //     followers: data.followers.filter((f) => f !== userId),
      //   })
      // );
      updateDoc(doc(db, "users", userId), {
        following: ownData.following.filter((f) => f !== user),
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
      <div className="flex flex gap-4 items-center">
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
      <div className="flex flex gap-4 items-center">
        <p>
          <strong>{amount}</strong> Followers
        </p>
        <p>
          <strong>{data.following.length}</strong> Following
        </p>

        <button onClick={handleUnfollow}>Unfollow</button>
      </div>
    );
  }
};

export default Follow;
