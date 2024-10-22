import React from 'react';
import robotImage from './JAKSON-IS-A-robot-image.png'; //LUCAS PUT A ROBOT PICTURE SOMEWHERE HERE

const Fourohfour = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[90vh] w-full">
      
      <img src={robotImage} alt="Robot" className="mb-4 w-32 h-32" />

      
      <div className="text-6xl font-bold text-center" style={{ fontFamily: 'Martian Mono, monospace' }}>
        404: Page/Search Not Found
      </div>
    </div>
  );
};

export default Fourohfour;
