import React from "react";

const OurTeam = () => {
  window.scrollTo(0, 0);

  const teamObject = [
    {
      image:
        "https://ik.imagekit.io/64c35uuyg/personalportfolio/IMG_1079.JPG?updatedAt=1712264407870",
      name: "Lucas",
      about: "Web Dev",
      link: "#",
    },
    {
      image:
        "https://ik.imagekit.io/64c35uuyg/b4stembio/ian2.jpg?updatedAt=1727047457553",
      name: "Ian",
      about: "Outreach",
      link: "https://instagram.com/ian.choi14/",
    },
    {
      image:
        "https://ik.imagekit.io/64c35uuyg/b4stembio/dhruva.jpg?updatedAt=1711050748800",
      name: "Dhruva",
      about: "DevOps",
      link: "https://www.instagram.com/dhruvaa.suri/",
    },
    {
      image:
        "https://ik.imagekit.io/64c35uuyg/b4stembio/1714620214604.png?updatedAt=1727301586788",
      name: "Julian",
      about: "Social Media",
      link: "https://www.instagram.com/juiian0/",
    },
  ];

  return (
    <div className="w-full min-h-screen px-[5%] pt-[6%] flex flex-col">
      <h1 className="text-4xl font-bold sm:text-5xl mb-[6%]">Our Team</h1>
      <div className="flex h-auto w-full flex-row flex-wrap justify-center gap-[5rem]">
        {teamObject.map((member, index) => {
          return (
            <div
              className="w-[350px] h-auto flex flex-col gap-2 items-start"
              key={index}
            >
              {member.name === "Lucas" ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className=" w-full h-[450px] object-cover bg-gray-400 rounded-md hover:scale-105 transition-all drop-shadow-sm cursor-pointer"
                />
              ) : (
                <a href={member.link} className="w-full h-auto" target="_blank">
                  <img
                    src={member.image}
                    alt={member.name}
                    className=" w-full h-[450px] object-cover bg-gray-400 rounded-md hover:scale-105 transition-all drop-shadow-sm cursor-pointer"
                  />
                </a>
              )}
              <h1 className="text-center text-2xl font-bold">{member.name}</h1>
              <p className="text-md text-start text-gray-500">{member.about}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OurTeam;
