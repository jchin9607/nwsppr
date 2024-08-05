import React from 'react'
import { useSignOut } from 'react-firebase-hooks/auth'
import { Link } from 'react-router-dom'
import { getDoc, doc } from "firebase/firestore";
import { useState } from 'react'
import { db } from '../firebase/firebase.js'
import { auth } from '../firebase/firebase.js'
import Searchbar from './Searchbar.jsx';

const Navbar = ({loggedIn}) => {
  let zuser = ""
  if (loggedIn) {zuser = "/p/" + loggedIn.uid} 
  const [ avatarImage, setAvatarImage ] = useState(null)

  // bandaid solution, check back soon, I want to sleep
  if (loggedIn) {
  getDoc(doc(db, "users", loggedIn?.uid)).then((docSnap) => {
    if (docSnap.exists()) {
      setAvatarImage(docSnap.data().photoURL)
    }
  })
}
 

  const [signOut, loading, error] = useSignOut(auth)

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error Signing Out!: {error.message}</div>
  }

  
  return (
    <div className='h-[60px] flex items-center justify-between w-full pl-[5%] pr-[5%]'>
        <Link to="/"><h1 className='text-4xl font-bold'>nwsppr.</h1> </Link>

       

        {/* if logged in it would display profile, write, and sign out buttons */}
        {loggedIn && 
        <div className="flex gap-4 items-center">
            <Link to="/write" >Write</Link>
            
            <Searchbar />
            <details className="dropdown dropdown-end">
              <summary className="m-1 list-none cursor-pointer"><div className="avatar">
                  <div className="w-10 rounded-full">
                    {avatarImage && <img src={avatarImage} />}
                    {!avatarImage && <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"/>}
                  </div>
                </div>
              </summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <Link to={zuser}><li><a>Profile</a></li></Link>
                <Link to="/drafts"><li><a>Drafts</a></li></Link>
                <hr className='w-full h-[1px] my-1'/>
                <p className='cursor-pointer' onClick={() => signOut() }><li><a>Sign Out</a></li></p>
              </ul>
          </details>
        </div>
        }
    </div>
  )
}

export {Navbar}