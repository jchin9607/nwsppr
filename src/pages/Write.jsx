import React from 'react'
import Editor from '../components/Editor/Editor'
import { useParams } from 'react-router-dom'
import { db } from '../firebase/firebase.js'
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase.js'
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen.jsx';
import { Helmet } from 'react-helmet';

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
      setContent('Write something here...                                      ')
      setLoading(false)
    }
  }, [document])

  if (loading) {
    return <LoadingScreen />
  }

  return (
      <>
      <Helmet>
        <title>Write | Nwsppr.</title>
      </Helmet>
      <div className="p-[2%] pt-[5%] w-[100%]  flex flex-col justify-between relative mb-[50%] gap-10 md:p-[5%] md:flex-row-reverse md:min-h-[90vh] md:mb-0 md:gap-0">
        
        {!loading && <Editor editing={true} content={content} editingDraft={document} title={titleData} description={descriptionData} cover={coverData} tags={tagsData}/>}
        
      </div>
      </>
  )
}

export default Write