import { useState, useEffect } from 'react'

import { ValidatorInfo } from '@northstake/northstakeapi'

const useFetchValidators = () => {
  const [validators, setValidators] = useState<ValidatorInfo[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchValidators = async () => {
    setIsRefreshing(true)
    const response = await fetch('/api/listValidators', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const result = await response.json()
    if (result.success && Array.isArray(result.validators)) {
      setValidators(result.validators)
    } else {
      console.error(result.error)
    }
    setIsRefreshing(false)
  }

  useEffect(() => {
    fetchValidators()
    const interval = setInterval(fetchValidators, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  return { validators, isRefreshing, fetchValidators }
}

export default useFetchValidators
