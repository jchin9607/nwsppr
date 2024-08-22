import React from 'react'
import { useState, useEffect } from 'react'
import LoadingScreen from './LoadingScreen.jsx'
import Edit from '../components/Profile/Edit.jsx'
import { useDeleteUser } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/firebase.js'
import { doc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase/firebase.js'
import { useSignOut } from 'react-firebase-hooks/auth'

const Settings = () => {
    const data = JSON.parse(localStorage.getItem('user')) || null
    const [pageLoading, setPageLoading] = useState(true)
    const [deleteUser, loading, error] = useDeleteUser(auth);
    const [pageError, setPageError] = useState(null)

    const [signOut] = useSignOut(auth);

    useEffect(() => {
        if (!data) {window.location.replace('/')} 
        else { setPageLoading(false) }
    }, [])
        

    if (pageLoading) {
      <LoadingScreen />
    }

    function deleteAccount() {
        const docRef = doc(db, "users", data.uid);
        deleteDoc(docRef).then(() => {
            deleteUser().then(() => {
                localStorage.clear()
                signOut()
            }).catch((error) => {
                setPageError(error)
            })
        }).catch((error) => {
            setPageError(error)
            console.log(error)
        })
    }
  return (
    <div className='w-full h-screen px-[5%]'>
    <h1>Settings</h1>
    <h2>Edit Profile</h2>
        <Edit userURL={data?.uid} data={data}/>
    <h2>Delete Account</h2>
        <button className="btn" onClick={()=>document.getElementById('deleteAccount').showModal()}>Delete Account</button>
            <dialog id="deleteAccount" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Delete Account</h3>
                <p className="py-4">Are you sure you want to delete your account?</p>
                {pageError && <p className="text-red-500">{pageError}</p>}
                <div className="modal-action">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Close</button>
                </form>
                <button className="btn btn-error" onClick={() => deleteAccount()}>Delete</button>
                </div>
            </div>
            </dialog>
    <h2>Sign Out</h2>
        <button className="btn" onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}

export default Settings