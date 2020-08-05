import React from 'react'
import { Link } from 'react-router-dom'

const buttonMenu = ({src, href, children}) => {
  return (
    <Link to={href} className='relative w-full h-full'>
      <div className='absolute top-0 left-0 z-20 w-full h-full bg-gray-700 bg-opacity-75 hover:bg-opacity-0' />
      <img className='object-fill' src={src} alt='' />
      <p className='absolute bottom-0 w-full p-2 text-xl font-semibold bg-gray-700 bg-opacity-75'>{children}</p>
    </Link>
  )
}

export default buttonMenu
