import React from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase.js'
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from 'react'
import ArticleAuthor from '../article/ArticleAuthor.jsx';
import { useNavigate } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import Likes from '../article/Likes.jsx';


const Article = () => {
    const {articleId} = useParams()
    const [cachedData, setCachedData] = useState(JSON.parse(localStorage.getItem(articleId)));
    const [loading, setLoading] = useState(true);

    const [date , setDate] = useState('');

    const navigate = useNavigate();
    
  
  
  
  useEffect(() => {
    if (!cachedData) {
      fetchArticle();
      
    }
    else {
      
      
      if (cachedData.date instanceof Timestamp) {
        setDate(cachedData.date.toDate().toLocaleDateString("en-us", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }));
      } else {
        const { seconds, nanoseconds } = cachedData.date;
        const date = new Date(seconds * 1000 + nanoseconds / 1000000);
        setDate(date.toLocaleDateString("en-us", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }));
      }
      setLoading(false);
    }
  }, [cachedData]);
  
  function fetchArticle() {
    
    
    const docRef = doc(db, "articles", articleId);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        localStorage.setItem(articleId, JSON.stringify(data));
        setCachedData(data);
        
        setLoading(false);
      } else {
        console.log('No such document!');
        navigate('/404');
        return null
      }
    });
    
  }

  

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return (

    <div className="w-full flex justify-center mb-[20vh]">
    <div className="flex flex-col w-[80vw] items-center justify-start min-h-screen pt-[5%]">
      
      <div className="prose prose-sm sm:prose lg:prose-lg w-full">
      <div className="text-5xl font-bold" >{cachedData.title}</div>
      <div className="text-md mt-[30px]">{date}</div>
      <div className="text-2xl mt-[30px]">{cachedData.description}</div>
      </div>

      <img src={cachedData.cover || 'https://images.unsplash.com/photo-1719937206168-f4c829152b91?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} alt=""
      className='prose prose-sm sm:prose lg:prose-lg w-full h-full object-cover mt-[30px]'
      />
      <div className="prose prose-sm sm:prose lg:prose-lg w-full my-[30px] h-[100px]">
        <ArticleAuthor useruid={cachedData.author} />
        <Likes article={cachedData} articleId={articleId}/>
      </div>
      <div className="prose prose-sm sm:prose lg:prose-lg w-full mb-[20px]">
        {cachedData.tags && cachedData.tags.map((tag) => <span className="badge badge-accent mr-2">#{tag}</span>)}
      </div>
      <div className="prose prose-sm sm:prose lg:prose-lg w-full mb-[30px]">
        <hr className="h-[1px]"/>
      </div>
      <div className='prose prose-sm sm:prose lg:prose-lg  break-words w-full' dangerouslySetInnerHTML={{__html: cachedData.content}}></div>
    </div>
    </div>
  )
}

export default Article