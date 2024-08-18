import React from 'react'
import { useState } from 'react'
import CommentCard from './CommentCard'
import { db } from '../firebase/firebase'
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
const Comment = ({ comments, articleId }) => {
    const [allComments, setAllComments] = useState(comments || [])
    const [loading, setLoading] = useState(false)

    function addComment(comment) {
        setLoading(true)
        let articleList = JSON.parse(localStorage.getItem("articlesList"))?.docs || null
        let articleListItem = articleList ? articleList.find((item) => item.id === articleId) : null
        const index = articleList?.indexOf(articleListItem)

        const docRef = doc(db, "articles", articleId)  
        const commentObject = {
            comment: comment,
            author: JSON.parse(localStorage.getItem('user')).uid
        }

        updateDoc(docRef, {comments: arrayUnion(commentObject)}).then(() => {
            localStorage.setItem(articleId, JSON.stringify({...JSON.parse(localStorage.getItem(articleId)), comments: allComments.concat(commentObject)}))
            setAllComments(allComments.concat(commentObject))
            document.getElementById('commentInput').value = ''
            if (articleListItem) {
                articleListItem.comments = articleListItem.comments.concat(commentObject)
                articleList[index] = articleListItem
                localStorage.setItem("articlesList", JSON.stringify({docs: articleList}))
            }
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoading(false)
        })

    }

  return (
    <>
    <div onClick={()=>document.getElementById('commentSection').showModal()} className='h-[30px] w-[30px] ml-3 cursor-pointer bg-transparent'><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 24 24">
<path d="M12,2C6.477,2,2,6.477,2,12c0,1.592,0.382,3.091,1.043,4.427l-1.005,4.019c-0.229,0.915,0.6,1.745,1.516,1.516 l4.019-1.005C8.909,21.618,10.408,22,12,22c5.523,0,10-4.477,10-10C22,6.477,17.523,2,12,2z" opacity=".35" fill='gray'></path>
</svg></div>
    {allComments?.length || 0}
    <dialog id="commentSection" className="modal">
        <div className="modal-box">
            <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg">Comments</h3>
            <div className="max-h-[300px] overflow-y-auto">
            <p className="pb-4 flex flex-col gap-6">
                {allComments.length > 0 ? allComments.map((comment) => <CommentCard comment={comment} />) : <p>No comments yet</p>}
            </p>
            </div>
            <div className="flex items-center">
                <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-full text-white" id='commentInput' />
                {loading ? <button className="btn btn-sm ml-2 loading">Loading</button> : 
                <button onClick={() => addComment(document.getElementById('commentInput').value)} className="btn btn-sm ml-2">Submit</button>}
            </div>
        </div>
    </dialog>
    </>
  )
}

export default Comment