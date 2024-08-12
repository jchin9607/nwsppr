import React from 'react'
import { doc, setDoc, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useState, useEffect } from 'react'

const Follow = ({user, data}) => {
    const ownData = JSON.parse(localStorage.getItem("user"))
    const [follow, setFollow] = useState(false)
    const [loading, setLoading] = useState(true)
    const [amount, setAmount] = useState(data.followers.length)
    

    useEffect(() => {
        
        if (data.followers.includes(ownData.uid)) {
            setFollow(true);
            
        }
        setAmount(data.followers.length)
        setLoading(false)
        
    }, [data, user]);
    function handleFollow(  ) {
        setLoading(true)
        updateDoc(doc(db, "users", user), {followers: arrayUnion(ownData.uid)} ).then(() => {
            const cacheRef = JSON.parse(localStorage.getItem(user))
            localStorage.setItem(user, JSON.stringify({...cacheRef, followers: cacheRef.followers.concat(ownData.uid)}))
            updateDoc(doc(db, "users", ownData.uid), {following: arrayUnion(user)} ).then(() => {
                localStorage.setItem('user', JSON.stringify({...ownData, following: ownData.following.concat(user)}))
                setFollow(true);
                setAmount(amount + 1)
                setLoading(false)
                // window.location.reload()
            })
        })
        
    }

    function handleUnfollow() {
        setLoading(true)
        updateDoc(doc(db, "users", user), {followers: data.followers.filter(f => f !== ownData.uid)} ).then(() => {
            localStorage.setItem(user, JSON.stringify({...data, followers: data.followers.filter(f => f !== ownData.uid)}))
            updateDoc(doc(db, "users", ownData.uid), {following: ownData.following.filter(f => f !== user)} ).then(() => {
                localStorage.setItem('user', JSON.stringify({...ownData, following: ownData.following.filter(f => f !== user)}))
                setFollow(false);
                setAmount(amount - 1)
                setLoading(false)
                // window.location.reload()
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
            <div className='flex flex gap-4 items-center'>
                <p><strong>{amount}</strong> Followers</p>
                <p><strong>{data.following.length}</strong> Following</p>
                <button onClick={handleFollow}>Follow</button>
            </div>
        )
    }
    else {
        return (
            <div className='flex flex gap-4 items-center'>
                <p><strong>{amount}</strong> Followers</p>
                <p><strong>{data.following.length}</strong> Following</p>
                
                <button onClick={handleUnfollow}>Unfollow</button>
            </div>
        )
    }
}

export default Follow