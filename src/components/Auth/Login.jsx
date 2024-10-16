import React from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";

const Login = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  return (
    // <div className="w-[300px] h-[400px] border border-black rounded-md  p-6 flex flex-col justify-between">
    <div>
      {/* <h1 className="text-center text-2xl font-bold">Login/Signup</h1> */}

      {!loading ? (
        <form className="h-[40%] flex flex-col justify-between items-start">
          <button
            className="w-full flex items-center justify-around bg-white text-black rounded-md p-2 border border-black"
            onClick={() => signInWithGoogle()}
          >
            <svg
              class="mr-2 -ml-1 w-4 h-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Continue with Google
          </button>
        </form>
      ) : (
        <button className="max-w-[300px] bg-white text-black rounded-md p-2 border border-black">
          Loading...
        </button>
      )}

      {error && <p>{error.message}</p>}
    </div>
  );
};

export default Login;
