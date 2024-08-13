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
        const docRef = doc(db, "articles", articleId)  
        const commentObject = {
            comment: comment,
            author: JSON.parse(localStorage.getItem('user')).uid
        }

        updateDoc(docRef, {comments: arrayUnion(commentObject)}).then(() => {
            localStorage.setItem(articleId, JSON.stringify({...JSON.parse(localStorage.getItem(articleId)), comments: allComments.concat(commentObject)}))
            setAllComments(allComments.concat(commentObject))
            document.getElementById('commentInput').value = ''
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoading(false)
        })

    }

  return (
    <>
    <div onClick={()=>document.getElementById('commentSection').showModal()} className='h-[30px] w-[30px] ml-3 cursor-pointer'><svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 450.27"><path d="M217.91 393.59c53.26 49.01 127.33 63.27 201.39 31.71l63.49 24.97-9.94-59.73c59.07-51.65 45.36-123.42-1.79-173.93-3.69 19.53-10.48 38.07-19.94 55.27-14.17 25.77-34.46 48.67-59.31 67.52-24.07 18.27-52.17 32.61-82.8 41.87-28.16 8.51-58.91 12.91-91.1 12.32zm-85.88-167.22c-7.7 0-13.95-6.25-13.95-13.95 0-7.7 6.25-13.95 13.95-13.95h124.12c7.7 0 13.94 6.25 13.94 13.95 0 7.7-6.24 13.95-13.94 13.95H132.03zm0-71.41c-7.7 0-13.95-6.25-13.95-13.95 0-7.71 6.25-13.95 13.95-13.95h177.35c7.7 0 13.94 6.24 13.94 13.95 0 7.7-6.24 13.95-13.94 13.95H132.03zM226.13.12l.21.01c60.33 1.82 114.45 23.27 153.19 56.49 39.57 33.92 63.3 80.1 61.82 130.51l-.01.23c-1.56 50.44-28.05 95.17-69.62 126.71-40.74 30.92-96.12 49.16-156.44 47.39-15.45-.46-30.47-2.04-44.79-4.82-12.45-2.42-24.5-5.75-36-10.05L28.17 379.06l31.85-75.75c-18.2-15.99-32.94-34.6-43.24-55.01C5.29 225.51-.72 200.48.07 174.33c1.52-50.49 28.02-95.26 69.61-126.82C110.44 16.59 165.81-1.65 226.13.12zm-.55 27.7-.21-.01C171.49 26.23 122.33 42.3 86.41 69.55c-35.07 26.61-57.39 63.9-58.65 105.54-.65 21.39 4.31 41.94 13.78 60.72 10.01 19.82 25.02 37.7 43.79 52.58l8.26 6.54-16.99 40.39 59.12-18.06 4.5 1.81c11.15 4.48 23.04 7.9 35.48 10.31 13.07 2.55 26.59 3.98 40.34 4.39 53.88 1.58 103.04-14.49 138.96-41.74 35.07-26.61 57.39-63.9 58.65-105.54v-.22c1.19-41.57-18.82-80.01-52.15-108.59-34.18-29.3-82.19-48.24-135.92-49.86z"/></svg></div>
    {comments?.length}
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