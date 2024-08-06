

import React from 'react'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase';


const Login = () => {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

    

  return (
    // <div className="w-[300px] h-[400px] border border-black rounded-md  p-6 flex flex-col justify-between">
      <div>
         {/* <h1 className="text-center text-2xl font-bold">Login/Signup</h1> */}

        {!loading 
            ?
            <form className="h-[40%] flex flex-col justify-between items-start">
                <button className="max-w-[300px] bg-white text-black rounded-md p-2 border border-black" onClick={() => signInWithGoogle()}>Continue with Google</button>
                
            </form>
            :
            <button className="max-w-[300px] bg-white text-black rounded-md p-2 border border-black">Loading...</button>
        }

        {error && <p>{error.message}</p>}
     </div>
  )
}

export default Login