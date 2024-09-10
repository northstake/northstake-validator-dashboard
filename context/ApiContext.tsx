'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import dotenv from 'dotenv'

dotenv.config()

interface ApiContextProps {
  api: { apiKey: string; privateKey: string; server: string } | null
  setApi: (api: { apiKey: string; privateKey: string; server: string }) => void
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
  const [api, setApi] = useState<ApiContextProps['api']>(filledCredentials)

  const logout = () => {
    setApi(null)
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
