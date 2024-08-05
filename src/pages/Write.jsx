import React from 'react'
import Editor from '../components/Editor/Editor'
import { useParams } from 'react-router-dom'
import { db } from '../firebase/firebase.js'
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase.js'
import { useNavigate } from 'react-router-dom';

const Write = () => {
  const [loading, setLoading] = useState(true)
  const [titleData, setTitleData] = useState('')
  const [descriptionData, setDescriptionData] = useState('')
  const [coverData, setCoverData] = useState('')
  const [tagsData, setTagsData] = useState([])
  const [content, setContent] = useState('Write something here...   ')
  const { document } = useParams()
  const [user] = useAuthState(auth)

  const navigate = useNavigate()
  
  useEffect(() => {
    if (document) {
      
      const docRef = doc(db, "articles", document)
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.data().author !== user.uid || docSnap.data().draft === false) {
            window.location = '/'
            return
          }
          setContent(docSnap.data().content)
          setTitleData(docSnap.data().title)
          setDescriptionData(docSnap.data().description)
          setCoverData(docSnap.data().cover)
          setTagsData(docSnap.data().tags)
          setLoading(false)
        })
        .catch((error) => {
          console.log(error)
          navigate('/404')
          return 

        })
    } else {
      setContent('Write something here...')
      setLoading(false)
    }
  }, [document])

  return (
      <>
      
      <div className="p-[5%] pt-[5%] w-[100%]  flex flex-row-reverse justify-between relative min-h-[90vh]">
        
        {!loading && <Editor editing={true} content={content} editingDraft={document} title={titleData} description={descriptionData} cover={coverData} tags={tagsData}/>}
        
      </div>
      </>
  )
}

export default Write