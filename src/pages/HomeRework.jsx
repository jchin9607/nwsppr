import React from "react";
import TagsControl from "../components/Home/TagsControl";

const HomeRework = ({ userId }) => {
  return (
    <div className="min-h-screen px-[5%] w-full">
      <TagsControl userId={userId ? userId : null} />
    </div>
  );
};

export default HomeRework;
