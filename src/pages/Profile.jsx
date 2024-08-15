import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SuggestedPost from '../components/SuggestedPost';
import {UseProfileData} from '../hooks/UseProfileData.js';
import FollowOrEdit from '../components/Profile/FollowOrEdit.jsx';
import { useState,  } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase/firebase.js';
import GetProfileArticles from '../components/Profile/GetProfileArticles.jsx';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen.jsx';
import { Helmet } from 'react-helmet';
import Loading from '../components/Loading.jsx';
const Profile = () => {
 
  const { user } = useParams();
  const { profileData, loading, error } = UseProfileData(user);
  const ownData = JSON.parse(localStorage.getItem("user"))
  
  const navigate = useNavigate();
  

  if (loading) {
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="skeleton h-[30vh] w-full"></div>
        <div className="w-full h-[340px]  px-[5%] flex flex-col gap-5">
        <div className="skeleton h-10 w-28"></div>
          <div className="skeleton h-10 w-28"></div>
          <div className="skeleton h-10 w-full"></div>
          <div className="skeleton h-10 w-full"></div>
        </div>
        <div className="w-full flex flex-col px-[5%] h-auto">
          <Loading />
          <Loading />
          <Loading />
        </div>
      </div>

    )
  }

  if (error) {
    navigate('/404')
    return
  }
  
  
    

  return (
    
      <div className=" min-h-screen w-full ">
        <Helmet>
          <title>{profileData.fullName} | writeup.</title>
        </Helmet>
          <div className="w-full h-[30vh] bg-slate-400 ">
            <img src={profileData.bannerURL || 'https://www.colorabq.com/cdn/shop/products/C9E6C0_1024x.png?v=1647354715'} alt="" className='w-full h-full object-cover'/>
          </div>
          <div className="w-full h-[340px]  px-[5%]">
              {/* Profile Header and Header */}
              <div className="flex flex-col w-full h-full relative gap-5 top-[-60px]">
                  <img className="w-[125px] h-[125px] rounded-full object-cover" src={profileData.photoURL || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} alt="Rounded avatar"  />
                  <div className="flex flex-row gap-5"><h1 className="text-3xl font-bold">{profileData.fullName}</h1></div>
                  <h1 className="text-1xl font-normal text-gray-500">@{profileData.username}</h1>
                  <div className='flex gap-3 font-normal text-gray-500'><p>
                    {/* {profileData.followers?.length}  Followers</p><p>{profileData.following?.length}  Following */}
                    <FollowOrEdit user={user} data={profileData}/>
                    </p>
                  {/* <p>{profileData.articles?.length}  Articles</p> */}
                  </div>
                  <p className="text-lg mt-2">{profileData.bio}</p>
              </div>
          </div>
  
          <div className="w-full flex flex-col px-[5%] h-auto">
              <hr className='border-gray-400'/>
              <GetProfileArticles user={user} draft={false} />
          </div>
      </div>
  );
};

export default Profile;