import React from "react";
import HomeArticleSection from "./HomeArticleSection";
import ArticleAuthor from "../../article/ArticleAuthor";
import { useState } from "react";

const TagsControl = ({ userId }) => {
  const [filterList, setFilterList] = useState(
    JSON.parse(localStorage.getItem("filterList")) || [
      "business",
      "entertainment",
      "general",
      "health",
      "science",
      "sports",
      "technology",
    ]
  );
  const [currentFilter, setCurrentFilter] = useState(null);
  const [filter, setFilter] = useState(null);
  const [sort, setSort] = useState(true);
  const [sortAll, setSortAll] = useState(true);

  function handleAddFilter(value) {
    if (!filterList.includes(value) && value) {
      setFilterList((prevFilterList) => [
        ...prevFilterList,
        value.toLowerCase(),
      ]);
      localStorage.setItem(
        "filterList",
        JSON.stringify([...filterList, value.toLowerCase()])
      );
    }
  }

  function handleRemoveFilter(value) {
    if (filterList.includes(value)) {
      setFilterList((prevFilterList) =>
        prevFilterList.filter((prevFilter) => prevFilter !== value)
      );
      localStorage.setItem(
        "filterList",
        JSON.stringify(filterList.filter((prevFilter) => prevFilter !== value))
      );
    }
  }

  function settingFilter(value) {
    if (currentFilter === value) {
      setFilter(null);
      setCurrentFilter(null);
    } else {
      setFilter(value);
      setCurrentFilter(value);
    }
  }

  return (
    <div className="flex w-full h-full justify-center mt-7">
      <div className="flex-col gap-[10px] sticky top-[60px] hidden h-[50%] md:flex md:w-[25%] lg:flex lg:w-1/6  ">
        <p>Topics</p>
        <div>
          <span
            className={
              sortAll
                ? "badge badge-accent mr-2 cursor-pointer border-4 text-white"
                : "badge badge-accent mr-2 cursor-pointer "
            }
            onClick={() => setSortAll(true)}
          >
            All
          </span>
          {userId && (
            <span
              className={
                !sortAll
                  ? "badge badge-accent mr-2 cursor-pointer border-4 text-white"
                  : "badge badge-accent mr-2 cursor-pointer"
              }
              onClick={() => setSortAll(false)}
            >
              Following
            </span>
          )}
          <div className="divider my-0 w-[85%]"></div>
          {/* <span className="badge badge-accent mr-2 cursor-pointer " onClick={() => setFilter(null)}>Following</span> */}
          {filterList.map((filterKey) => (
            <span
              className={`badge badge-accent mr-2 cursor-pointer ${
                currentFilter === filterKey && "text-white"
              }`}
              key={filterKey}
            >
              <div onClick={() => settingFilter(filterKey)}>#{filterKey}</div>
              <div
                onClick={() => handleRemoveFilter(filterKey)}
                className="text-white cursor-pointer ml-1"
              >
                x
              </div>
            </span>
          ))}
          <div className="dropdown dropdown-hover">
            <span
              tabIndex={0}
              role="button"
              className="badge badge-accent mr-2 cursor-pointer bg-white"
            >
              +
            </span>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <input
                id="tagAdder"
                type="text"
                placeholder="Add Tag"
                className="input input-bordered w-full max-w-xs"
              />
              <li>
                <a
                  onClick={() =>
                    handleAddFilter(document.getElementById("tagAdder").value)
                  }
                >
                  Add
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div></div>
      </div>

      <>
        <div className="w-full lg:w-7/12">
          <h1 className="text-6xl font-bold">Trending</h1>
          <div className="dropdown dropdown-hover">
            <div tabIndex={0} role="button" className="btn m-1">
              Sort By: {sort ? "Popular" : "Newest"}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a onClick={() => setSort(true)}>Popular</a>
              </li>
              <li>
                <a onClick={() => setSort(false)}>Newest</a>
              </li>
            </ul>
          </div>
          <hr className="my-6" />
          <HomeArticleSection
            filter={filter}
            userId={userId ? userId : null}
            sort={sort}
            sortAll={sortAll}
          />
        </div>
      </>
      <div className="w-1/4  pl-[3%] h-[100%] flex-col hidden lg:flex">
        <h1 className="">Recommended Users</h1>

        <ArticleAuthor
          useruid="zfT5WjRouGQKEH1rXWeszeWZJdr2"
          inArticle={false}
        />
        {/* <h1 className="">Suggested Post</h1> */}
      </div>
    </div>
  );
};

export default TagsControl;
