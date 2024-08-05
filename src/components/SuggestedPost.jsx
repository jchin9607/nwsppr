import React from 'react'
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Link } from 'react-router-dom'
import { Timestamp } from 'firebase/firestore';


const SuggestedPost = ({article, articleData}) => {
  const [cachedData, setCachedData] = useState(JSON.parse(localStorage.getItem(article)));
  const [loading, setLoading] = useState(true);
  const [date , setDate] = useState('');
  
  
  
  useEffect(() => {
    if (!cachedData) {
      // fetchArticle();
      
      localStorage.setItem(article, JSON.stringify(articleData));
      setCachedData(articleData);
      setLoading(false);
    }
    else {
      
      if (cachedData.date instanceof Timestamp) {
        setDate(cachedData.date.toDate().toLocaleDateString("en-us", { year: 'numeric', month: 'long', day: 'numeric' }));
      } else {
        const { seconds, nanoseconds } = cachedData.date;
        const date = new Date(seconds * 1000 + nanoseconds / 1000000);
        setDate(date.toLocaleDateString("en-us", { year: 'numeric', month: 'long', day: 'numeric' }));
      }
      setLoading(false);

      setLoading(false);
      
    }
  }, [cachedData]);
  
  function fetchArticle() {
    
    // this function will fetch the article from firebase, but it is costly, so i am using a local storage method
    const docRef = doc(db, "articles", article);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        localStorage.setItem(article, JSON.stringify(data));
        setCachedData(data);
        setLoading(false);
      } else {
        console.log('No such document!');
        return null
      }
    });
    
  }

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <>
    <Link to={'/article/' + article}>
    <div className='w-full  min-h-[250px] flex cursor-pointer '>
      <div className='w-2/3 flex flex-col justify-between items-start py-10'>
        {/* {cachedData.author} */}
        <h1 className='text-3xl font-bold font-gupter' >{cachedData.title}</h1>
        <p className='text-md text-gray-500 font-normal'>{cachedData.description}</p>
        <p className='text-sm text-gray-500 font-normal'>{date}</p>
      </div>
      <div className='w-1/3 flex items-center justify-end'>
      <img src={cachedData.cover || 'https://images.unsplash.com/photo-1719937206168-f4c829152b91?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} alt=""
      className='w-[225px] h-[150px] object-cover'
      />
      </div>
      
    </div>
    </Link>
    <hr className="border-gray-300" />
    </>
  )
}

export default SuggestedPost