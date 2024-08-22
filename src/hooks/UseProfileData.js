import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '../firebase/firebase';

const UseProfileData = (user) => {
  const cachedProfileData = JSON.parse(localStorage.getItem(user));
  const [profileData, setProfileData] = useState(cachedProfileData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        
        if (profileData !== null) {
          
          if (JSON.parse(localStorage.getItem('user')).uid === user) {
           
            setProfileData(JSON.parse(localStorage.getItem("user")));
            console.log('profileData is not null');
          }
          else {
            
            setProfileData(cachedProfileData);
          }
          return;
        }
        
        const docRef = doc(db, 'users', user);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
          const data = {
            ...docSnap.data(),
            email: "haha you thought this was an email"
          }
          localStorage.setItem(user, JSON.stringify(data));
        } else {
          setError('Deleted User');
        }
      } catch (err) {
        setError(`Error getting document: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return { profileData, loading, error };
};

export {UseProfileData};