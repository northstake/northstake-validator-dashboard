import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { RFQDocumentSeller } from '@northstake/northstakeapi'
import NotificationBar from '@/components/NotificationBar'

interface RFQContextType {
  rfqs: RFQDocumentSeller[]
  isRefreshing: boolean
  fetchRFQs: () => Promise<void>
}

interface Notification {
  message: string
  rfqId: string
}

/*
We need to keep our RFQ documents in context so that we can access them throughout the app, for notifications for example.
*/
const RFQContext = createContext<RFQContextType | undefined>(undefined)

export const RFQProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rfqs, setRFQs] = useState<RFQDocumentSeller[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [notification, setNotification] = useState<Notification | null>(null)
  const prevRFQsRef = useRef<RFQDocumentSeller[]>([])

  const fetchRFQs = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/listRFQDocuments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
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

  useEffect(() => {
    fetchRFQs()
    const interval = setInterval(fetchRFQs, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (prevRFQsRef.current.length > 0) {
      const activeRFQs = rfqs.filter(rfq => rfq.status.toLowerCase() === 'active')
      const prevActiveRFQs = prevRFQsRef.current.filter(rfq => rfq.status.toLowerCase() === 'active')

      if (JSON.stringify(activeRFQs) !== JSON.stringify(prevActiveRFQs)) {
        const changedRFQ = activeRFQs.find(rfq => !prevActiveRFQs.some(prevRFQ => prevRFQ.id === rfq.id))
        if (changedRFQ) {
          const prevRFQ = prevActiveRFQs.find(prevRFQ => prevRFQ.id === changedRFQ.id)
          if (prevRFQ) {
            const currentSteps = Object.keys(changedRFQ.settlement_steps || {})
            const previousSteps = Object.keys(prevRFQ.settlement_steps || {})
            const newSteps = currentSteps.filter(step => !previousSteps.includes(step))

            if (newSteps.length > 0) {
              setNotification({
                message: `New settlement step(s) added: ${newSteps.join(', ')} for RFQ document: ${changedRFQ.id}`,
                rfqId: changedRFQ.id
              })
            } else if (changedRFQ.best_quote !== prevRFQ.best_quote) {
              setNotification({
                message: `New best quote: ${changedRFQ.best_quote} for RFQ document: ${changedRFQ.id}`,
                rfqId: changedRFQ.id
              })
            } else {
              setNotification({
                message: `Active RFQ document was updated: ${changedRFQ.id}`,
                rfqId: changedRFQ.id
              })
            }
          } else {
            setNotification({
              message: `Active RFQ document was updated: ${changedRFQ.id}`,
              rfqId: changedRFQ.id
            })
          }
        }
      }
    }
    prevRFQsRef.current = rfqs
  }, [rfqs])

  return (
    <RFQContext.Provider value={{ rfqs, isRefreshing, fetchRFQs }}>
      {children}
      {notification && (
        <NotificationBar
          message={notification.message}
          rfqId={notification.rfqId}
          onClose={() => setNotification(null)}
        />
      )}
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
