import React from 'react'
import { UseProfileData } from '../hooks/UseProfileData'
import { Link } from 'react-router-dom'

const ArticleAuthor = ({useruid}) => {
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
          <div className="w-20 rounded-full">
            <img src={profileData.photoURL} />
          </div>
        </div>
        <div>
       By: <Link to={'/p/' + profileData.uid}>{profileData.fullName}</Link> 
       </div>
    </div>
  )
}

export default ArticleAuthor