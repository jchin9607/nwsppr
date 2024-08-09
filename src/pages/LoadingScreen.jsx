import React from 'react'

const LoadingScreen = () => {
  return (
    <>
    <div className="w-full h-screen flex justify-center items-center pb-[3%]">
      <div className="newtons-cradle">
              <div className="newtons-cradle__dot"></div>
              <div className="newtons-cradle__dot"></div>
              <div className="newtons-cradle__dot"></div>
              <div className="newtons-cradle__dot"></div>
      </div>
    </div>
    </>
  )
}

export default LoadingScreen