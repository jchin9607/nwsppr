import React from 'react'
import { useState } from 'react'
import { updateDoc, doc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from '../firebase/firebase.js'

const Likes = ({article, articleId}) => {

    const [likes, setLikes] = useState(article.likes.length)
    const [liked, setLiked] = useState(article.likes.includes(JSON.parse(localStorage.getItem('user')).uid))

    function handleLike(increment, liked) {
        setLikes(parseInt(likes) + parseInt(increment))
        setLiked(liked)
    }

    function handleLikes() {
        const docRef = doc(db, "articles", articleId);
        if (liked) {
            updateDoc(docRef, {likes: article.likes.filter((author) => author !== JSON.parse(localStorage.getItem('user')).uid)}).then(() => {
                handleLike(-1, false)
                localStorage.setItem(articleId, JSON.stringify({...article, likes: article.likes.filter((author) => author !== JSON.parse(localStorage.getItem('user')).uid)}))
                console.log(localStorage.getItem(articleId))
            })
            
        } else {
            updateDoc(docRef, {likes: arrayUnion(JSON.parse(localStorage.getItem('user')).uid)}).then(() => {
                handleLike(1, true)
                const likeCount = JSON.parse(localStorage.getItem(articleId))
                localStorage.setItem(articleId, JSON.stringify({...article, likes: likeCount.likes.concat(JSON.parse(localStorage.getItem('user')).uid)}))
                console.log(localStorage.getItem(articleId))
            })
            
        }
    }
  return (
    <div className='h-[50px] items-center w-full'>
        <div className="rating gap-1 flex w-full h-full items-center">
            {liked 
            ? <input type="radio" name="rating-3" className="mask mask-heart bg-red-400"  onClick={handleLikes}/>
            : <input type="radio" name="rating-3" className="mask mask-heart bg-gray-400"  onClick={handleLikes}/>}
            <p>{likes}</p>
        </div>
    </div>
  )
}

export default Likes