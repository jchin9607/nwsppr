import React from 'react'
import { auth } from '../../firebase/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { setDoc, doc } from "firebase/firestore";
import { db } from '../../firebase/firebase.js'
import Follow from './Follow.jsx'
import Edit from './Edit.jsx'


const FollowOrEdit = ({user, data}) => {

    

    const [userLoggedIn, loading, error] = useAuthState(auth)

    if (loading) {
        return <button>Loading...</button>
    }

    if (error) {
        return <button>Error</button>
    }

    if (!userLoggedIn) {
        return null
    }


    if (userLoggedIn && user !== userLoggedIn.uid) return (
        <>
        {/* {data.followers.length} Followers
        {data.following.length} Following */}
        <Follow user={user} data={data} />
        </>
    )

    if (userLoggedIn && user === userLoggedIn.uid) return (
        <div className='flex flex gap-4 items-center'>
                <p><strong>{data.followers.length}</strong> Followers</p>
                <p><strong>{data.following.length}</strong> Following</p>
            <Edit userURL={user} data={data} />
        </div>
    )
}

export default FollowOrEdit