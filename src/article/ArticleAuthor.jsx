import React from "react";
// import { UseProfileData } from "../hooks/UseProfileData";
import UseProfileDataQuery from "../hooks/UseProfileDataQuery";
import { Link } from "react-router-dom";

const ArticleAuthor = ({ useruid, inArticle, inComment }) => {
  const { data, isLoading: loading, error } = UseProfileDataQuery(useruid);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const profileData = data.data();

  return (
    <div className="flex items-center gap-6">
      <div className="avatar not-prose">
        <div className="w-14 rounded-full bg-gray-400">
          <img
            src={
              profileData.photoURL ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            role="presentation"
          />
        </div>
      </div>
      <div>
        {inArticle && "By:"}{" "}
        <Link to={"/p/" + profileData.uid}>{profileData.fullName}</Link>
        <div className="text-sm">{inComment && inComment}</div>
      </div>
    </div>
  );
};

export default ArticleAuthor;
