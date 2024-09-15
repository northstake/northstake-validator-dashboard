import { useState, useEffect } from 'react'
import { useApi } from '../context/ApiContext'
import { ValidatorInfo } from '@northstake/northstakeapi'

const useFetchValidators = () => {
  const [validators, setValidators] = useState<ValidatorInfo[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { api } = useApi()

  const fetchValidators = async () => {
    if (api) {
      setIsRefreshing(true)
      const response = await fetch('/api/listValidators', {
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
      if (result.success && Array.isArray(result.validators)) {
        setValidators(result.validators)
      } else {
        console.error(result.error)
      }
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchValidators()
    const interval = setInterval(fetchValidators, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [api])

  return { validators, isRefreshing, fetchValidators }
}

export default useFetchValidators
