import React from 'react'

const OurTeam = () => {
    window.scrollTo(0, 0);

    const teamObject = [
        {
            image: "https://ik.imagekit.io/64c35uuyg/b4stembio/lucas.png?updatedAt=1711050748800",
            name: 'Lucas C.',
            about: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere, nulla.'
        },
        {
            image: "https://ik.imagekit.io/64c35uuyg/b4stembio/ian.jpg?updatedAt=1711050748800",
            name: 'Ian C.',
            about: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere, nulla.'
        },
        {
            image: "https://ik.imagekit.io/64c35uuyg/b4stembio/dhruva.jpg?updatedAt=1711050748800",
            name: 'Dhruva S.',
            about: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere, nulla.'
        }
    ]

  return ( 
    <div className="w-full min-h-screen px-[5%] pt-[4%] flex flex-col" >
        <h1 className="text-4xl font-bold sm:text-5xl mb-[4%]">Our Team</h1>
        <div className='flex h-auto w-full flex-row flex-wrap justify-center gap-[5rem]'>
            {teamObject.map((member, index) => {
                return (
                    <div className='w-[350px] h-auto flex flex-col gap-2 items-start' key={index}>
                        <img src={member.image} alt={member.name} className=' w-full h-[450px] object-cover' />
                        <h1 className="text-center text-2xl font-bold">{member.name}</h1>
                        <p className="text-md text-start text-gray-500">{member.about}</p>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default OurTeam