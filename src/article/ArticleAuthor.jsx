import React from 'react'
import { UseProfileData } from '../hooks/UseProfileData'
import { Link } from 'react-router-dom'


const ArticleAuthor = ({useruid, inArticle, inComment}) => {
    const {profileData, loading, error} = UseProfileData(useruid)
    
    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>{error}</div>
    }
  return (
    <div className='flex items-center gap-6'>
        <div className="avatar not-prose">
          <div className="w-14 rounded-full">
            <img src={profileData.photoURL} />
          </div>
        </div>
        <div>
       {inArticle && "By:"} <Link to={'/p/' + profileData.uid}>{profileData.fullName}</Link> 
       <div className='text-sm'>{inComment && inComment}</div>
       </div>
    </div>
  )
}

export default ArticleAuthor