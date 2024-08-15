import React from 'react'
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase/firebase';
import { Link } from 'react-router-dom'
import SuggestedPost from '../components/SuggestedPost.jsx'
import GetProfileArticles from '../components/Profile/GetProfileArticles.jsx';
import { Helmet } from 'react-helmet';
const Drafts = () => {
    const [loading, setLoading] = useState(true);
    let userData = JSON.parse(localStorage.getItem('user'))
    // const [articles, setArticles] = useState([]);
    

    useEffect(() => {
      if (!userData) {
          console.log('no user found')
          window.location.replace('/');
      }
      else {
          // const q = query(collection(db, "articles"), where("author", "==", userData.uid), where("draft", "==", true));
          // getDocs(q).then((querySnapshot) => {
          //   setArticles(querySnapshot);
            
          // }).catch(error => {
          //   console.log(error);
          // });
          
          
          setLoading(false);
      }
  }, [])
  
  


  if (loading) {
    return <p>Loading...</p>
  }
  return (
    
    <div className="w-full px-[15%] min-h-screen">
      <Helmet>
        <title>Drafts | writeup.</title>
      </Helmet>
        <h1 className='text-7xl font-bold my-10'>Your Drafts</h1>
        {/* {!loading && articles && articles.docs && articles.docs.map((doc) => {
              return (
              <Link to={'/write/' + doc.id}>
                <div className='w-full  h-[250px] flex cursor-pointer'>
                <div className='w-2/3 flex flex-col justify-between items-start py-6'>
                  {userData.fullName}
                  <h1 className='text-3xl font-bold'>{doc.data().title}</h1>
                  <p className='text-md color-gray'>{doc.data().description}</p>
                  
                </div>
                <div className='w-1/3 flex items-center justify-end'>
                <img src="https://media.istockphoto.com/id/1406960186/photo/the-skyline-of-new-york-city-united-states.jpg?s=612x612&w=0&k=20&c=yZJXNdzq3d5bKgvVzPBahBujpbVUXFyjyl9FN9L7esM=" alt=""
                className='w-[200px] h-[100px] object-cover'
                />
                </div>
                
              </div>
              <hr className='w-full h-[1px]'/>
              </Link>
              )
            })} */}
        
        <GetProfileArticles user={userData.uid} draft={true} />
    </div>
  )
}

export default Drafts