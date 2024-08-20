import React from 'react'
import { useState } from 'react'
import { updateDoc, doc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from '../firebase/firebase.js'
import Comment from './Comment.jsx'

const Likes = ({article, articleId, notClickable}) => {

    const [likes, setLikes] = useState(article.likes.length)
    const [liked, setLiked] = useState(article.likes.includes(JSON.parse(localStorage.getItem('user')).uid))
    
    function handleLike(increment, liked) {
        setLikes(parseInt(likes) + parseInt(increment))
        setLiked(liked)
    }

    function handleLikes() {
        if (notClickable) return
        const docRef = doc(db, "articles", articleId);
        let articleList = JSON.parse(localStorage.getItem("articlesList"))?.docs || null
        let articleListItem = articleList ? articleList.find((item) => item.id === articleId) : null
        const index = articleList?.indexOf(articleListItem)
        
        if (liked) {
            updateDoc(docRef, {likes: article.likes.filter((author) => author !== JSON.parse(localStorage.getItem('user')).uid)}).then(() => {
                handleLike(-1, false)
                localStorage.setItem(articleId, JSON.stringify({...article, likes: article.likes.filter((author) => author !== JSON.parse(localStorage.getItem('user')).uid)}))
                if (articleListItem) {
                    articleListItem.likes = articleListItem.likes.filter((author) => author !== JSON.parse(localStorage.getItem('user')).uid)
                    articleList[index] = articleListItem
                    localStorage.setItem("articlesList", JSON.stringify({docs: articleList}))
                    
                }
            })
            
        } else {
            updateDoc(docRef, {likes: arrayUnion(JSON.parse(localStorage.getItem('user')).uid)}).then(() => {
                handleLike(1, true)
                const likeCount = JSON.parse(localStorage.getItem(articleId))
                localStorage.setItem(articleId, JSON.stringify({...article, likes: likeCount.likes.concat(JSON.parse(localStorage.getItem('user')).uid)}))
                if (articleListItem) {
                    articleListItem.likes = articleListItem.likes.concat(JSON.parse(localStorage.getItem('user')).uid)
                    articleList[index] = articleListItem
                    localStorage.setItem("articlesList", JSON.stringify({docs: articleList}))
                    
                }
            })
            
        }
    }
  return (
    <div className='h-[50px] items-center w-full'>
        <div className="rating gap-1 flex w-full h-full items-center">
            {liked 
            ? <><input type="radio" name="rating-3" className="mask mask-heart bg-red-400"  onClick={handleLikes} aria-label="Unlike"/></>
            : <input type="radio" name="rating-3" className="mask mask-heart bg-gray-400"  onClick={handleLikes} aria-label="Like"/>}
            <p>{likes}</p>
            <Comment comments={article.comments} articleId={articleId}/>
        </div>
    </div>
  )
}

export default Likes