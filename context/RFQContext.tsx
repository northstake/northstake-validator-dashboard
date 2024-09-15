import React, { createContext, useContext, useEffect, useState } from 'react'
import { RFQDocumentSeller } from '@northstake/northstakeapi'
import { useApi } from './ApiContext'

interface RFQContextType {
  rfqs: RFQDocumentSeller[]
  isRefreshing: boolean
  fetchRFQs: () => Promise<void>
}

const RFQContext = createContext<RFQContextType | undefined>(undefined)

export const RFQProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { api } = useApi()
  const [rfqs, setRFQs] = useState<RFQDocumentSeller[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchRFQs = async () => {
    if (api) {
      setIsRefreshing(true)
      try {
        const response = await fetch('/api/listRFQDocuments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            apiKey: api.apiKey,
            privateKey: api.privateKey,
            server: api.server
          })
        })
        const result = await response.json()
        if (result.success && Array.isArray(result.documents)) {
          const orderedRFQs = result.documents.sort((a: RFQDocumentSeller, b: RFQDocumentSeller) => {
            if (a.status.toLowerCase() === 'active' && b.status.toLowerCase() !== 'active') {
              return -1
            }
            if (a.status.toLowerCase() !== 'active' && b.status.toLowerCase() === 'active') {
              return 1
            }
            return 0
          })
          setRFQs(orderedRFQs)
        } else {
          console.error(result.error)
        }
      } catch (error) {
        console.error('Failed to fetch RFQ documents', error)
      }
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchRFQs()
    const interval = setInterval(fetchRFQs, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [api])

  return (
    <RFQContext.Provider value={{ rfqs, isRefreshing, fetchRFQs }}>
      {children}
    </RFQContext.Provider>
  )
}

export const useRFQ = () => {
  const context = useContext(RFQContext)
  if (context === undefined) {
    throw new Error('useRFQ must be used within a RFQProvider')
  }
  return context
}