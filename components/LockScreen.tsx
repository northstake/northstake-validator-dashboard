import React from 'react'
import ApiCredentialsForm from './ApiCredentialsForm'

const LockScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 z-50 ">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <svg className="mx-auto h-24 w-24 text-indigo-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h2 className="text-2xl font-semibold text-white text-center mb-4">API Credentials Required</h2>
        <p className="text-sm text-gray-400 text-center mb-6">Please enter your API credentials to get started.</p>
        <ApiCredentialsForm />
      </div>
    </div>
  )
}

export default LockScreen
