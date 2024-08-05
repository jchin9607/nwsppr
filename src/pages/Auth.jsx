import React from 'react'
import Login from '../components/Auth/Login'

const Auth = () => {
  return (
    <div className="h-[95vh] w-[100%] flex items-start justify-center flex-col px-[10vw] gap-[2rem] xs:px-[5%]">
      <div className="flex flex-col">
        <h3 className="text-2xl font-bold">Nwsppr.</h3>
        <h1 className="text-7xl font-bold">For Students,</h1>
        <h1 className="text-7xl font-bold">By Students</h1>
      </div>
      {/* <h3>Share your story with the world</h3> */}
      <div><p>🌘 This website is still being developed! </p>
      <p>Contact us if you find any bugs/vulnerablilites </p>
      </div>
      
      <Login/>

      <div className='absolute w-[45vw] h-[600px] right-[0] z-[-10]'>
        <div className="mockup-window border-base-300 border w-full h-full ">
          <div className="border-base-300 flex flex-col justify-center items-center border-t px-4 py-16 gap-3">
            <h1 className="text-center font-bold text-2xl ">The History of the Planets</h1>
            <h3 className="text-center px-[15%]" >Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere, nulla.</h3>
            <img src="https://t4.ftcdn.net/jpg/03/90/44/31/360_F_390443161_kePNWkpdy36iQT15C9t32zY3brRlXzO8.jpg" alt="" />
            </div>
        </div>
      </div>
    </div>
  )
}

export default Auth