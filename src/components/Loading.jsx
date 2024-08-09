import React from 'react'

const Loading = () => {
  return (
    <div className="flex w-full flex-row-reverse gap-4 h-[250px] items-center">
        <div className="skeleton h-32 w-1/3"></div>
        <div className="flex flex-col gap-2 w-2/3">
          <div className="skeleton h-6 w-28"></div>
          <div className="skeleton h-6 w-full"></div>
          <div className="skeleton h-6 w-full"></div>
        </div>
      </div>
  )
}

export default Loading