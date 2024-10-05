import React from "react";
import Login from "../components/Auth/Login";

const Auth = () => {
  return (
    <div className=" w-[100%] flex items-center  px-[10vw] flex-col min-h-[200vh] justify-around pb-0 half:flex-row  half:min-h-[100vh]  half:justify-between half:pb-[5%]">
      <div className="flex flex-col gap-6 h-full w-full half:w-[45%] ">
        <div>
          <h3 className="text-2xl font-bold hidden half:block">writeup.</h3>
          <h1 className="text-4xl font-bold sm:text-7xl">For Students,</h1>
          <h1 className="text-4xl font-bold sm:text-7xl">By Students</h1>
        </div>
        <div>
          <p>
            🌎 Join a free, student-run 501(c)(3) platform to share your
            thoughts and ideas.
          </p>
          <p>
            📝 Write and share articles with students worldwide and connect with
            a global community.
          </p>
        </div>

        <div className="w-[300px]">
          <Login />
        </div>
      </div>
      {/* <h3>Share your story with the world</h3> */}

      <div className=" right-[0] z-[-10]  w-full  h-full half:w-[45%] half:h-[600px]">
        <div className="mockup-window border-base-300 border w-full h-full ">
          <div className="border-base-300 flex flex-col justify-center items-center border-t px-4 py-16 gap-3">
            <h1 className="text-center font-bold text-2xl ">
              The History of the Planets
            </h1>
            <h2 className="text-center px-[15%]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere,
              nulla.
            </h2>
            <img
              src="https://t4.ftcdn.net/jpg/03/90/44/31/360_F_390443161_kePNWkpdy36iQT15C9t32zY3brRlXzO8.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
