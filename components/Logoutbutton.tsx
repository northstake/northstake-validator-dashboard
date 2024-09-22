import React from 'react'
import { useApi } from '../context/ApiContext'
import { FaSignOutAlt } from 'react-icons/fa'

const LogoutButton = ({ className = '' }) => {
  const { logout } = useApi()

  return (
    <button
      onClick={logout}
      className={`flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md transition-colors duration-150 w-full ${className}`}
    >
      <FaSignOutAlt className="mr-2" />
      Sign out
    </button>
  )
}

export default LogoutButton