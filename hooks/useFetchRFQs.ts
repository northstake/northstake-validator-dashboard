import { useState, useEffect } from 'react'
import { useApi } from '../context/ApiContext'
import { RFQDocumentSeller } from '@northstake/northstakeapi'

const useFetchRFQs = () => {
  const [rfqs, setRFQs] = useState<RFQDocumentSeller[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { api } = useApi()

  const fetchRFQs = async () => {
    if (api) {
      setIsRefreshing(true)
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
        // Order RFQs by active status first
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
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchRFQs()
    const interval = setInterval(fetchRFQs, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [api])

  return { rfqs, isRefreshing, fetchRFQs }
}

export default useFetchRFQs
