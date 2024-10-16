import React from "react";
import { auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Follow from "./Follow.jsx";
import Edit from "./Edit.jsx";

const FollowOrEdit = ({ user, data, userId }) => {
  // const ownData = JSON.parse(localStorage.getItem("user"));

  const [userLoggedIn, loading, error] = useAuthState(auth);

  if (loading) {
    return <button>Loading...</button>;
  }

  if (error) {
    return <button>Error</button>;
  }

  if (!userLoggedIn) {
    return null;
  }

  if (userLoggedIn && user !== userLoggedIn.uid)
    return (
      <>
        {/* {data.followers.length} Followers
        {data.following.length} Following */}
        <Follow user={user} data={data} userId={userId} />
      </>
    );

  if (userLoggedIn && user === userLoggedIn.uid)
    return (
      <div className="flex gap-4 items-center">
        <Edit userURL={userLoggedIn.uid} data={data} />
      </div>
    );
};

export default FollowOrEdit;
