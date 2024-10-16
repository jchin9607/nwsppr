import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className="divider mt-[200px]"></div>
      <div className="w-full h-auto px-[5%] flex flex-col-reverse justify-center items-center ">
        {/* <div className='min-h-[100px] w-full  py-[1%] justify-center items-center flex flex-col'>
        <p>©Nwsppr. 2024 
        </p>
        <p>Website built by Lucas C. </p>
        
        
    </div>
     */}

        <div className="flex flex-col justify-end h-full">
          <p className="text-3xl"></p>
          <p
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-[8vw] cursor-pointer"
          >
            ©writeup.
          </p>
        </div>
        <div className="flex w-full h-full justify-center items-center gap-10 text-xs flex-col mb-5 sm:flex-row">
          <a
            href="https://hcb.hackclub.com/donations/start/writeup"
            target="_blank"
          >
            Donate
          </a>
          <Link to="/join">Join</Link>
          <a href="https://discord.gg/xXaXAjEN47" target="_blank">
            Contact Us
          </a>
          <Link to="/tos">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </>
  );
};

export default Footer;
