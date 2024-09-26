import React, { useEffect, useState } from 'react'
import ApiCredentialsForm from './ApiCredentialsForm'
import { useUser } from '../context/userContext'
import { toast } from 'react-toastify'

const LockScreen = () => {
  const { setUserInfo, setContractAddress, setLoading } = useUser()
  const [isVerifying, setIsVerifying] = useState(true)

  const verifyApi = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (data.success && data.user && data.user.userId) {
        setUserInfo(data.user)
        if (data.user?.smartContracts?.[0]?.address) {
          setContractAddress(data.user.smartContracts[0].address as `0x${string}`)
        }
        setLoading(false)
        return true
      } else {
        throw new Error('Failed to verify API credentials')
      }
    } catch (error) {
      console.error('Failed to verify API credentials', error)
      toast.error('Invalid API credentials. Please try again.')
      return false
    }
  }

  useEffect(() => {
    const initialVerify = async () => {
      if (process.env.API_KEY && process.env.PRIVATE_KEY) {
        const isValid = await verifyApi()
        if (!isValid) {
          setIsVerifying(false)
        }
      }
    }
    initialVerify()
  }, [])

  const handleApiSubmit = async () => {
    setIsVerifying(true)
    const isValid = await verifyApi()
    if (isValid) {
      // No need to set API credentials in context or cookies
    } else {
      setIsVerifying(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 z-50">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <svg className="mx-auto h-24 w-24 text-indigo-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-2xl font-semibold text-white text-center mb-4">Verifying API Credentials...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <svg className="mx-auto h-24 w-24 text-indigo-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h2 className="text-2xl font-semibold text-white text-center mb-4">API Credentials Required</h2>
        <p className="text-sm text-gray-400 text-center mb-6">Please enter your API credentials to get started.</p>
        <ApiCredentialsForm onSubmit={handleApiSubmit} />
        <p className="text-sm text-gray-400 text-center mt-4">Server: {process.env.NEXT_PUBLIC_SERVER}</p>
      </div>
    </div>
  )
}

export default LockScreen