import React from "react";
// import { UseProfileData } from "../hooks/UseProfileData";
import UseProfileDataQuery from "../hooks/UseProfileDataQuery";
import { Link } from "react-router-dom";

const ArticleAuthor = ({ useruid, inArticle, inComment }) => {
  const { data, isLoading: loading, error } = UseProfileDataQuery(useruid);

  if (loading) {
    return (
      <div className="flex items-center gap-6">
        <div className="avatar not-prose">
          <div className="w-14 rounded-full bg-gray-400">
            <div class="skeleton h-14 w-14 shrink-0 rounded-full"></div>
          </div>
        </div>
        <div></div>
      </div>
    );
  }

  if (error) {
    return <div>User Does Not Exist: {error}</div>;
  }

  const profileData = data.data();

  return (
    <div className="flex items-center gap-6">
      <div className="avatar not-prose">
        <div className="w-14 rounded-full bg-gray-400">
          <Link to={"/p/" + profileData.uid} aria-label="to author profile">
            <img
              src={
                profileData.photoURL ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              role="presentation"
            />
          </Link>
        </div>
      </div>
      <div>
        {inArticle && "By:"}{" "}
        <Link to={"/p/" + profileData.uid} aria-label="to author profile">
          {profileData.fullName}
        </Link>
        <div className="text-sm">{inComment && inComment}</div>
      </div>
    </div>
  );
};

export default ArticleAuthor;
