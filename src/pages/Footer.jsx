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
          <p className="text-[8vw]">©writeup.</p>
        </div>
        <div className="flex w-full h-full justify-center items-center gap-10 text-xs flex-col mb-5 sm:flex-row">
          <Link to="/team">Our Team</Link>
          <a href="https://hcb.hackclub.com/donations/start/writeup">Donate</a>
          <a href="https://forms.gle/X9bYG5JYJnMMrLy56" target="_blank">
            Join
          </a>
          <a href="https://discord.gg/xXaXAjEN47" target="_blank">
            Contact Us
          </a>
          <a href="">Terms of Service</a>
          <a href="">Privacy Policy</a>
        </div>
      </div>
    </>
  );
};

export default Footer;
