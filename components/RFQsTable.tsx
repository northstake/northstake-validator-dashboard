import { useEffect, useState } from 'react'
import { useApi } from '../context/ApiContext'
import { RFQDocumentSeller } from '@northstake/northstakeapi'
import React from 'react'
import { toast } from 'react-toastify'

// New component for expanded content
const ExpandedContent = ({ rfq }: { rfq: RFQDocumentSeller }) => {
  //make an array of all settlement steps
  const steps = Object.entries(rfq.settlement_steps || {})


  const sortedSteps = steps.sort((a, b) => {
    return a[0].localeCompare(b[0])
  })

  const { api } = useApi()

  const getEtherscanLink = (txHash: string) => {
    const baseUrl = api?.server === 'production' ? 'https://etherscan.io' : 'https://holesky.etherscan.io'
    return `${baseUrl}/tx/${txHash}`
  }

  return (
    <tr>
      <td colSpan={6}>
        <div className='p-4 bg-gray-50'>
          {sortedSteps &&
            sortedSteps.map(([stepName, stepData]) => (
              <div key={stepName} className='mb-2'>
                <h5 className='font-semibold'>
                  {stepName.replace(/_/g, ' ').charAt(0).toUpperCase() + stepName.replace(/_/g, ' ').slice(1)}
                </h5>
                <ul>
                  {stepData &&
                    typeof stepData === 'object' &&
                    Object.entries(stepData).map(([key, value]) => (
                      <li key={key}>
                        {key}:{' '}
                        {typeof value === 'string' && value.startsWith('0x') && value.length === 66 ? (
                          <a
                            href={getEtherscanLink(value)}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:underline'
                          >
                            {value}
                          </a>
                        ) : typeof value === 'object' ? (
                          JSON.stringify(value)
                        ) : value !== null && value !== undefined ? (
                          String(value)
                        ) : (
                          ''
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
        </div>
      </td>
    </tr>
  )
}

const RFQsTable = () => {
  const [rfqs, setRFQs] = useState<RFQDocumentSeller[]>([])
  const { api } = useApi()
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [loadingQuoteId, setLoadingQuoteId] = useState<string | null>(null)
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
    new Set(['active', 'finished', 'rejected', 'expired', 'failed'])
  )

  const fetchRFQs = async () => {
    if (api) {
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
    }
  }

  useEffect(() => {
    fetchRFQs()
  }, [api])

  const toggleRowExpansion = (id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'expired':
        return 'bg-red-100 text-yellow-800'
      case 'finished':
        return 'bg-blue-100 text-blue-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAcceptQuote = async (rfqId: string, quoteId: string) => {
    if (!api) {
      toast.error('No API credentials found')
      return
    }
    if (confirm('Are you sure you want to accept this quote?')) {
      setLoadingQuoteId(quoteId)
      try {
        const response = await fetch('/api/acceptQuote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            apiKey: api.apiKey,
            privateKey: api.privateKey,
            server: api.server,
            rfqId,
            quoteId
          })
        })

        const result = await response.json()
        if (!result.success) {
          toast.error('Could not accept quote')
        } else {
          toast.success('Quote accepted successfully')
          // Refetch the RFQs list
          fetchRFQs()
        }
      } catch (error) {
        toast.error('Failed to accept quote')
      } finally {
        setLoadingQuoteId(null)
      }
    }
  }

  const handleRejectQuote = async (rfqId: string, quoteId: string) => {
    if (!api) {
      toast.error('No API credentials found')
      return
    }
    if (confirm('Are you sure you want to reject this quote?')) {
      setLoadingQuoteId(quoteId)
      try {
        const response = await fetch('/api/rejectQuote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            apiKey: api.apiKey,
            privateKey: api.privateKey,
            server: api.server,
            rfqId,
            quoteId
          })
        })

        const result = await response.json()
        if (!result.success) {
          toast.error('Could not reject quote')
        } else {
          toast.success('Quote rejected successfully')
          // Refetch the RFQs list
          fetchRFQs()
        }
      } catch (error) {
        toast.error('Failed to reject quote')
      } finally {
        setLoadingQuoteId(null)
      }
    }
  }

  const handleStatusChange = (status: string) => {
    setSelectedStatuses(prev => {
      const newSet = new Set(prev)
      if (newSet.has(status)) {
        newSet.delete(status)
      } else {
        newSet.add(status)
      }
      return newSet
    })
  }

  const filteredRFQs = rfqs.filter(rfq => selectedStatuses.has(rfq.status.toLowerCase()))

  return (
    <div className='overflow-x-auto'>
      <div className='mb-4'>
        {['active', 'finished', 'rejected', 'expired', 'failed'].map(status => (
          <label key={status} className='mr-4'>
            <input
              type='checkbox'
              checked={selectedStatuses.has(status)}
              onChange={() => handleStatusChange(status)}
              className='mr-2'
            />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </label>
        ))}
      </div>
      {filteredRFQs.length === 0 ? (
        <div className='flex flex-col items-center justify-center h-64'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-16 w-16 text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12h6m2 0a2 2 0 100-4H7a2 2 0 100 4h10zm0 0a2 2 0 110 4H7a2 2 0 110-4h10z'
            />
          </svg>
          <p className='text-gray-500 mt-2'>No active RFQs</p>
        </div>
      ) : (
        <table className='min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
          <thead className='bg-gray-900 h-12'>
            <tr>
              <th className='px-4 py-2 text-left text-gray-100'>Validators</th>
              <th className='px-4 py-2 text-left text-gray-100'>Status</th>
              <th className='px-4 py-2 text-left text-gray-100'>Amount</th>
              <th className='px-4 py-2 text-left text-gray-100'>Best quote</th>
              <th className='px-4 py-2 text-left text-gray-100'>Estimated final exit</th>
              <th className='px-4 py-2 text-left text-gray-100'>Escrow address</th>
              <th className='px-4 py-2 text-left text-gray-100'>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredRFQs?.map(rfq => (
              <React.Fragment key={rfq.id}>
                <tr className='border-b border-gray-200 hover:bg-gray-100'>
                  <td className='px-4 py-2'>
                    {rfq.validators?.map((v, index) => (
                      <React.Fragment key={v.validator_index}>
                        <a
                          href={`https://${api?.server === 'production' ? '' : 'holesky.'}beaconcha.in/validator/${
                            v.validator_index
                          }`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-600 hover:underline'
                        >
                          {v.validator_index}
                        </a>
                        {index < rfq.validators.length - 1 ? ', ' : ''}
                      </React.Fragment>
                    ))}
                  </td>
                  <td className='px-4 py-2'>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(rfq.status)}`}>{rfq.status}</span>
                  </td>
                  <td className='px-4 py-2'>{rfq.total_balance}</td>
                  <td className='px-4 py-2'>
                    {rfq.best_quote?.quote ? (
                      <div className='flex items-center'>
                        <span>{rfq.best_quote.quote}</span>
                        {loadingQuoteId === rfq.best_quote?.quote_id ? (
                          <div className='ml-2 loader'></div>
                        ) : (
                          rfq.status.toLowerCase() === 'active' &&
                          !rfq.settlement_steps?.accepted_quote && (
                            <>
                              <button
                                disabled={!rfq.best_quote?.quote_id}
                                onClick={() => handleAcceptQuote(rfq.id, rfq.best_quote?.quote_id as string)}
                                className='ml-2 text-green-600 hover:text-green-800'
                              >
                                ✔️
                              </button>
                              <button
                                onClick={() => handleRejectQuote(rfq.id, rfq.best_quote?.quote_id as string)}
                                className='ml-2 text-red-600 hover:text-red-800'
                              >
                                ❌
                              </button>
                            </>
                          )
                        )}
                      </div>
                    ) : (
                      'No quote yet'
                    )}
                  </td>
                  <td className='px-4 py-2'>
                    {rfq.estimated_all_validators_exited_at
                      ? new Date(rfq.estimated_all_validators_exited_at).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className='px-4 py-2'>
                    {rfq.unique_escrow_vault?.vault_address ? (
                      <a
                        href={`https://${api?.server === 'production' ? '' : 'holesky.'}etherscan.io/address/${
                          rfq.unique_escrow_vault.vault_address
                        }`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:underline'
                      >
                        {rfq.unique_escrow_vault.vault_address}
                      </a>
                    ) : rfq.status === 'active' ? (
                      'Escrow vault is created when a quote is accepted'
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className='px-4 py-2'>
                    <button onClick={() => toggleRowExpansion(rfq.id)} className='text-blue-600 hover:underline'>
                      {expandedRows.has(rfq.id) ? (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z'
                            clipRule='evenodd'
                          />
                          <path d='M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z' />
                        </svg>
                      ) : (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                          <path
                            fillRule='evenodd'
                            d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                      )}
                    </button>
                  </td>
                </tr>
                {expandedRows.has(rfq.id) && <ExpandedContent rfq={rfq} />}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default RFQsTable
