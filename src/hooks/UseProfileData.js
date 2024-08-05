import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '../firebase/firebase';

const UseProfileData = (user) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', user);
        const docSnap = await getDoc(docRef);
        console.log("read")
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        } else {
          setError('No such document!');
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