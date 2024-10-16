import React from "react";
import Search from "../pages/Search";

import { useNavigate } from "react-router-dom";
const { useState } = React;
const Searchbar = () => {
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  function handleClick(type) {
    navigate(`/search/${type}/${search}`);
    document.getElementById("my_modal_1").close();
  }

  return (
    <>
      <button
        className="btn btn-ghost btn-circle"
        aria-label="Search"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Hello!</h3>

          <p className="py-4">
            <label className="input input-bordered flex items-center gap-2 w-full max-w-lg ">
              <input
                type="text"
                className="w-full"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </p>

          {search && (
            <div className="flex flex-col gap-4 items-start w-full text-left">
              <button
                className="btn btn-ghost w-full"
                onClick={() => handleClick("articles")}
              >
                Articles: {search}
              </button>
              <button
                className="btn btn-ghost w-full"
                onClick={() => handleClick("users")}
              >
                Username: {search}
              </button>
              {/* <button className="btn btn-ghost w-full">Tags: {search}</button> */}
            </div>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Searchbar;
