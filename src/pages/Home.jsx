import React from 'react'
import SuggestedPost from '../components/SuggestedPost.jsx'
import { collection, orderBy, query, where, limit } from "firebase/firestore";
import { db } from '../firebase/firebase';
import {  useState, useEffect } from 'react';
import { getDocs } from 'firebase/firestore';
import UsePopularityAlgorithm from '../hooks/UsePopularityAlgorithm.js';


const Home = () => {
  
  const [loading, setLoading] = useState(true)
  const [ articles, setArticles ] = useState(null)
  const [filter , setFilter ] = useState(null)
  const [filterList, setFilterList] = useState(['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'])
  const [sort, setSort] = useState(true)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const q = query(collection(db, "articles")
  
  
  , where("draft", "==", false)
  , where("date" , ">", sevenDaysAgo)
  , orderBy("date", "desc")
  , limit(30)
  // find a better way to do this
  
  );


  

  useEffect(() => {
    if (!articles) {
      getDocs(q).then((querySnapshot) => {
       
        
        setArticles(querySnapshot)
        
        
        
        setLoading(false)
      });
    }
    else{
      
    setLoading(false)
    }
    
  }, []);

  function handleSort (bool) {

    setSort(bool)
   
    
  }


  
  
  
  return (
    <div className="px-[5%] min-h-screen">
      <div className="flex w-full h-full justify-center mt-7">
        <div className='w-1/6 flex flex-col gap-[10px] sticky top-[60px] h-[50%]'>
          <p>Topics</p>
          <div>
            <span className="badge badge-accent mr-2 cursor-pointer" onClick={() => setFilter(null)}>All</span>
            {/* <span className="badge badge-accent mr-2 cursor-pointer" onClick={() => setFilter('business')}>#business</span>
            <span className="badge badge-accent mr-2 cursor-pointer" onClick={() => setFilter('switching lanes')}>#switching lanes</span> */}
            {filterList.map((filter) => <span className="badge badge-accent mr-2 cursor-pointer" onClick={() => setFilter(filter)} key={filter}>{filter}</span>)}
            <span className="badge badge-accent mr-2 cursor-pointer bg-white">+</span>
          
          </div>
          <div>

          </div>
        </div>
        <div className='w-7/12'>

          
          {/* <SuggestedPost/>
          <SuggestedPost/>
          <SuggestedPost/>
          <SuggestedPost/>
          <SuggestedPost/>
          <SuggestedPost/>
          <SuggestedPost/>
          <SuggestedPost/> */}
          <h1 className="text-6xl font-bold">Trending</h1>
          <div className="dropdown dropdown-hover">
            <div tabIndex={0} role="button" className="btn m-1">Sort By: {sort ? "Trending <7" : "Newest"}</div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li onClick={() => handleSort(true)}><a>Trending</a></li>
              <li onClick={() => handleSort(false)}><a>Newest</a></li>
            </ul>
          </div>
          <hr className="my-6"/>
          {!loading && sort && articles && articles.docs && articles.docs
          .sort((a, b) => b.data().date.seconds - a.data().date.seconds)
          .sort((a, b) => UsePopularityAlgorithm(b.data().likes.length, b.data().date.seconds) - UsePopularityAlgorithm(a.data().likes.length, a.data().date.seconds))
          .filter((doc) => doc.data().tags.includes(filter) || filter === null)
          .map((doc) => {
              return <SuggestedPost article={doc.id} key={doc.id}/>
            })}

          {!loading && !sort && articles && articles.docs && articles.docs
          .sort((a, b) => b.data().date.seconds - a.data().date.seconds)
          .filter((doc) => doc.data().tags.includes(filter) || filter === null)
          .map((doc) => {
              return <SuggestedPost article={doc.id} key={doc.id}/>
            })}
            
          
        </div>
        <div className='w-1/4  pl-[3%] h-[100%] flex flex-col'>
          <h1 className="">Recommended Users</h1>
          <h1 className="">Suggested Post</h1>
        </div>
      </div>

    </div>
  )
}

export default Home