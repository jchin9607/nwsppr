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

    
        <Follow user={user} data={data} />
    )

    if (userLoggedIn && user === userLoggedIn.uid) return (
        <Edit userURL={user} data={data} />
    )
}

export default FollowOrEdit