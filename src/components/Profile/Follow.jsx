import React from 'react'
import { doc, setDoc, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useState, useEffect } from 'react'

const Follow = ({user, data}) => {
    const ownData = JSON.parse(localStorage.getItem("user"))
    const [follow, setFollow] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        
        if (data.followers.includes(ownData.uid)) {
            setFollow(true);
            setLoading(false)
        }
        else {
            setLoading(false)
        }
        
    }, [data, user]);
    function handleFollow(  ) {
        setLoading(true)
        updateDoc(doc(db, "users", user), {followers: arrayUnion(ownData.uid)} ).then(() => {
            
            updateDoc(doc(db, "users", ownData.uid), {following: arrayUnion(user)} ).then(() => {
                console.log("Followed");
                setFollow(true);
                
                window.location.reload()
            })
        })
        
    }

    function handleUnfollow() {
        setLoading(true)
        updateDoc(doc(db, "users", user), {followers: data.followers.filter(f => f !== ownData.uid)} ).then(() => {
            updateDoc(doc(db, "users", ownData.uid), {following: ownData.following.filter(f => f !== user)} ).then(() => {
                console.log("Unfollowed");
                setFollow(false);
                
                window.location.reload()
            })
        })
    }

    if (loading) {
        return (
            <button>Loading...</button>
        )
    }

    if (!follow) {
        return (
            
            <button onClick={handleFollow}>Follow</button>
        )
    }
    else {
        return (
            <button onClick={handleUnfollow}>Unfollow</button>
        )
    }
}

export default Follow