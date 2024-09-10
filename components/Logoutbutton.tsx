import React from 'react'
import { useApi } from '../context/ApiContext'

const LogoutButton = () => {
  const { logout } = useApi()

  return (
    <button
      onClick={logout}
      className='bg-red-500 hover:bg-red-600 text-white font-bold py-0 px-4 rounded w-full  m-5 mb-2 h-6'
    >
      Logout
    </button>
  )
}

export default LogoutButton