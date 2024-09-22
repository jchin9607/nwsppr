import React from "react";

const OurTeam = () => {
  window.scrollTo(0, 0);

  const teamObject = [
    {
      image:
        "https://ik.imagekit.io/64c35uuyg/personalportfolio/IMG_1079.JPG?updatedAt=1712264407870",
      name: "Lucas",
      about: "Web Dev",
    },
    {
      image:
        "https://media.discordapp.net/attachments/1270094209411448936/1287137439445549167/image.jpg?ex=66f073a7&is=66ef2227&hm=b947e93ac931ab0549c8fd3231219e70d0c3b392c390ba895fb1b433f2dfe0c4&=&format=webp&width=507&height=676",
      name: "Ian",
      about: "Social Media Manager",
    },
    {
      image:
        "https://ik.imagekit.io/64c35uuyg/b4stembio/dhruva.jpg?updatedAt=1711050748800",
      name: "Dhruva",
      about: "DevOps",
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
              <img
                src={member.image}
                alt={member.name}
                className=" w-full h-[450px] object-cover"
              />
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
