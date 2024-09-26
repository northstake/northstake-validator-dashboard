import React, { useEffect, useState } from 'react'
import ApiCredentialsForm from './ApiCredentialsForm'
import { useApi } from '../context/ApiContext'
import { useUser } from '../context/userContext'
import { toast } from 'react-toastify'

const LockScreen = () => {
  const { api, setApi, logout } = useApi()
  const { setUserInfo, setContractAddress, setLoading } = useUser()
  const [isVerifying, setIsVerifying] = useState(true)

  const server = process.env.NEXT_PUBLIC_SERVER || 'test'

  const verifyApi = async (apiCredentials: { apiKey: string; privateKey: string }) => {
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...apiCredentials, server })
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
      if (api) {
        const isValid = await verifyApi(api)
        if (!isValid) {
          logout()
        }
        setIsVerifying(false)
      } else {
        setIsVerifying(false)
      }
    }
    initialVerify()
  }, [api, logout])

  const handleApiSubmit = async (apiCredentials: { apiKey: string; privateKey: string }, keepSignedIn: boolean) => {
    setIsVerifying(true)
    const isValid = await verifyApi(apiCredentials)
    if (isValid) {
      setApi({ ...apiCredentials, server }, keepSignedIn)
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
        <p className="text-sm text-gray-400 text-center mt-4">Server: {server}</p>
      </div>
    </div>
  )
}

export default LockScreen