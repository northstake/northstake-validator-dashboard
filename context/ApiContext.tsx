'use client'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import Cookies from 'js-cookie'
import dotenv from 'dotenv'

dotenv.config()

interface ApiContextProps {
  api: { apiKey: string; privateKey: string; server: string } | null
  setApi: (api: { apiKey: string; privateKey: string; server: string }, keepSignedIn: boolean) => void
  logout: () => void
}

const ApiContext = createContext<ApiContextProps | undefined>(undefined)
const filledCredentials =
  process.env.NEXT_PUBLIC_API_KEY && process.env.NEXT_PUBLIC_PRIVATE_KEY
    ? {
        apiKey: process.env.NEXT_PUBLIC_API_KEY,
        privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY.replace(/\\n/g, '\n'),
        server: 'test'
      }
    : null

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [api, setApiState] = useState<ApiContextProps['api']>(filledCredentials)

  useEffect(() => {
    const savedApi = Cookies.get('api')
    if (savedApi) {
      setApiState(JSON.parse(savedApi))
    }
  }, [])

  const setApi = (api: { apiKey: string; privateKey: string; server: string }, keepSignedIn: boolean) => {
    setApiState(api)
    if (keepSignedIn) {
      Cookies.set('api', JSON.stringify(api), { expires: 7 }) // Set cookie to expire in 7 days
    } else {
      Cookies.remove('api') // Ensure the cookie is removed if not keeping signed in
    }
  }

  const logout = () => {
    setApiState(null)
    Cookies.remove('api')
  }

  return (
    <ApiContext.Provider value={{ api, setApi, logout }}>
      {children}
    </ApiContext.Provider>
  )
}

export const useApi = () => {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider')
  }
  return context
}
