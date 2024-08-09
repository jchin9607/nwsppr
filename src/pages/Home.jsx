import React from 'react'
import SuggestedPost from '../components/SuggestedPost.jsx'
import { collection, orderBy, query, where, limit } from "firebase/firestore";
import { db } from '../firebase/firebase';
import {  useState, useEffect } from 'react';
import { getDocs } from 'firebase/firestore';
import UsePopularityAlgorithm from '../hooks/UsePopularityAlgorithm.js';
import ArticleAuthor from '../article/ArticleAuthor.jsx';
import LoadingScreen from './LoadingScreen.jsx';
import { Helmet } from 'react-helmet';



const Home = () => {
  
  const [loading, setLoading] = useState(true)
  const [ articles, setArticles ] = useState(null)
  const [filter , setFilter ] = useState(null)
  const [filterList, setFilterList] = useState( JSON.parse(localStorage.getItem('filterList')) || ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'])
  const [sort, setSort] = useState(true)
  const [page, setPage] = useState(10)
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
       
        console.log(querySnapshot) 
        setArticles(querySnapshot)
      });
    }

    setLoading(false)
    
  }, []);

  function handleSort (bool) {

    setSort(bool)
   
    
  }

  function handleAddFilter(value) {
    if (!filterList.includes(value) && value) {
      setFilterList(prevFilterList => [...prevFilterList, value.toLowerCase()])
      localStorage.setItem('filterList', JSON.stringify([...filterList, value.toLowerCase()]))
      
    }
  }

  function handleRemoveFilter(value) {
    if (filterList.includes(value)) {
      setFilterList(prevFilterList => prevFilterList.filter(prevFilter => prevFilter !== value))
      localStorage.setItem('filterList', JSON.stringify(filterList.filter(prevFilter => prevFilter !== value)))
    }
  }

  
  if (loading) {
    return (<LoadingScreen/>)
  }
  
  
  return (
    <div className="px-[5%] min-h-screen">
      <Helmet>
        <title>Nwsppr.</title>
      </Helmet>
      <div className="flex w-full h-full justify-center mt-7">
        <div className='flex-col gap-[10px] sticky top-[60px] hidden h-[50%] md:flex md:w-[25%] lg:flex lg:w-1/6  '>
          <p>Topics</p>
          <div>
            <span className="badge badge-accent mr-2 cursor-pointer " onClick={() => setFilter(null)}>All</span>
            
            {filterList.map((filter) => <span className="badge badge-accent mr-2 cursor-pointer" key={filter}>
              <div onClick={() => setFilter(filter)}>#{filter}</div>
              <div onClick={() => handleRemoveFilter(filter)} 
                className='text-white cursor-pointer ml-1' 
                >x</div>
              </span>)}
            <div className="dropdown dropdown-hover">
            <span tabIndex={0} role="button" className="badge badge-accent mr-2 cursor-pointer bg-white">+</span>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <input id="tagAdder" type="text" placeholder="Add Tag" className="input input-bordered w-full max-w-xs" />
                <li><a onClick={() => handleAddFilter(document.getElementById("tagAdder").value)}>Add</a></li>
                </ul>
            </div>
          
          </div>
          <div>

          </div>
        </div>
        <div className='w-full lg:w-7/12'>

          
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
          .slice(0, page + 1)
          .map((doc) => {
              return <SuggestedPost article={doc.id} articleData={doc.data()} key={doc.id}/>
            })}

          {!loading && !sort && articles && articles.docs && articles.docs
          .sort((a, b) => b.data().date.seconds - a.data().date.seconds)
          .filter((doc) => doc.data().tags.includes(filter) || filter === null)
          .slice(0, page + 1)
          .map((doc) => {
              return <SuggestedPost article={doc.id} articleData={doc.data()} key={doc.id}/>
            })}

          <button onClick={() => setPage(page + 10)} className="btn my-10">Load More</button>
              
            
          
        </div>
        <div className='w-1/4  pl-[3%] h-[100%] flex-col hidden lg:flex'>
          <h1 className="">Recommended Users</h1>
            <ArticleAuthor useruid="zfT5WjRouGQKEH1rXWeszeWZJdr2" inArticle={false}/>
          {/* <h1 className="">Suggested Post</h1> */}
        </div>
      </div>

    </div>
  )
}

export default Home