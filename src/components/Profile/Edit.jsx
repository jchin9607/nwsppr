import React, { useEffect } from "react";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase.js";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/firebase.js";
import { collection, query, where, getDocs } from "firebase/firestore";
const Edit = ({ userURL, data }) => {
  const [user, loading, error] = useAuthState(auth);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  if (!user || userURL !== user.uid) return null;

  if (loading) {
    return <button>Loading...</button>;
  }

  if (error) {
    return <button>Error</button>;
  }

  const [userObject, setUserObject] = useState({
    fullName: data.fullName,
    username: data.username,
    bio: data.bio,
    photoURL: data.photoURL,
    bannerURL: data.bannerURL,
  });

  useEffect(() => {
    setUserObject({
      fullName: data.fullName,
      username: data.username,
      bio: data.bio,
      photoURL: data.photoURL,
      bannerURL: data.bannerURL,
    });
  }, [user, data]);

  const handleReset = () => {
    setUserObject({
      fullName: data.fullName,
      username: data.username,
      bio: data.bio,
      photoURL: data.photoURL,
      bannerURL: data.bannerURL,
    });
  };

  function handleSubmit() {
    setIsButtonLoading(true);
    const docRef = doc(db, "users", user.uid);

    if (!userObject.username || !userObject.fullName) {
      alert("Please enter a username/name");
      setIsButtonLoading(false);
      handleReset();
      return;
    }

    if (userObject.username !== data.username) {
      const q = query(
        collection(db, "users"),
        where("username", "==", userObject.username)
      );
      getDocs(q).then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          alert("Username already exists");
          setIsButtonLoading(false);
          handleReset();
          return;
        } else {
          updateDoc(docRef, {
            fullName: userObject.fullName,
            username: userObject.username,
            bio: userObject.bio,
          })
            .then(() => {
              if (userObject.photoURL !== data.photoURL) {
                handleUpload();
              } else {
                if (userObject.bannerURL !== data.bannerURL) {
                  handleBannerUpload();
                } else {
                  localStorage.clear();
                  window.location.reload();
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    } else {
      updateDoc(docRef, {
        fullName: userObject.fullName,
        username: userObject.username,
        bio: userObject.bio,
      })
        .then(() => {
          if (userObject.photoURL !== data.photoURL) {
            handleUpload();
          } else {
            if (userObject.bannerURL !== data.bannerURL) {
              handleBannerUpload();
            } else {
              localStorage.clear();
              window.location.reload();
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  function handleUpload() {
    if (userObject.photoURL === data.photoURL) {
      localStorage.clear();
      window.location.reload();
      return;
    }
    setIsButtonLoading(true);
    const imageRef = ref(storage, `images/${user.uid + "photoURL"}`);
    uploadBytes(imageRef, userObject.photoURL).then(() => {
      getDownloadURL(imageRef).then((url) => {
        const docRef = doc(db, "users", user.uid);
        updateDoc(docRef, {
          photoURL: url,
        }).then(() => {
          if (userObject.bannerURL !== data.bannerURL) {
            handleBannerUpload();
          } else {
            localStorage.clear();
            window.location.reload();
          }
        });
      });
    });
  }

  function handleBannerUpload() {
    setIsButtonLoading(true);
    const imageRef = ref(storage, `images/${user.uid + "bannerURL"}`);
    uploadBytes(imageRef, userObject.bannerURL).then(() => {
      getDownloadURL(imageRef).then((url) => {
        const docRef = doc(db, "users", user.uid);
        updateDoc(docRef, {
          bannerURL: url,
        }).then(() => {
          localStorage.clear();
          window.location.reload();
        });
      });
    });
  }

  return (
    <>
      <button onClick={() => document.getElementById("editUser").showModal()}>
        Edit Profile
      </button>
      <dialog id="editUser" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box flex flex-col gap-[10px]">
          <h2 className="font-bold text-lg">Edit Profile</h2>
          {/* <p className="py-4">Press ESC key or click the button below to close</p> */}
          <h4>Full Name</h4>
          <input
            type="text"
            placeholder="Full Name"
            className="input input-bordered w-full max-w-xs"
            value={userObject.fullName}
            onChange={(e) =>
              setUserObject({ ...userObject, fullName: e.target.value })
            }
          />
          <h4>Username</h4>
          <input
            type="text"
            placeholder="Username"
            className="input input-bordered w-full max-w-xs"
            value={userObject.username
              .replace(/[`~!@#$%^&*()|+\=?;:'",<>\{\}\[\]\\\/]/gi, "")
              .toLowerCase()}
            onChange={(e) =>
              setUserObject({ ...userObject, username: e.target.value })
            }
          />
          <h4>Bio</h4>
          <input
            type="text"
            placeholder="Bio"
            className="input input-bordered w-full "
            value={userObject.bio}
            onChange={(e) =>
              setUserObject({ ...userObject, bio: e.target.value })
            }
          />
          <h4>Photo</h4>
          <input
            id="profilepicture"
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
            value=""
            onChange={(e) =>
              setUserObject({ ...userObject, photoURL: e.target.files[0] })
            }
            accept="image/*"
            hidden
          />
          <label htmlFor="profilepicture" className="btn max-w-xs">
            Upload a new profile picture
          </label>
          <h4>Banner</h4>
          <input
            id="bannerpicture"
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
            value=""
            onChange={(e) =>
              setUserObject({ ...userObject, bannerURL: e.target.files[0] })
            }
            accept="image/*"
            hidden
          />
          <label htmlFor="bannerpicture" className="btn max-w-xs">
            Upload a new banner
          </label>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn" onClick={handleReset}>
                Close
              </button>
            </form>
            {isButtonLoading ? (
              <button className="btn loading">Loading</button>
            ) : (
              <button onClick={handleSubmit}>Save Profile</button>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Edit;
