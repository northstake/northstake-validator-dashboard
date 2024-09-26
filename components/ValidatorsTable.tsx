import { useEffect, useState } from 'react'
import { ValidatorInfo, CreateRFQRequest, Wallet } from '@northstake/northstakeapi'
import { toast } from 'react-toastify'
import Modal from './Modal'
import { FaWallet, FaTimes, FaCopy } from 'react-icons/fa'
import { useRFQ } from '@/context/RFQContext' // Import the useRFQ hook
import useFetchValidators from '@/hooks/useFetchValidators'

const ValidatorsTable = () => {
  const [selectedValidators, setSelectedValidators] = useState<Set<string>>(new Set())
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [validatorsPerPage, setValidatorsPerPage] = useState(50)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null)
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set(['active', 'activating', 'exited']))
  const { rfqs, fetchRFQs } = useRFQ() // Use the useRFQ hook
  const { validators, fetchValidators, isRefreshing } = useFetchValidators()

  useEffect(() => {
    fetchValidators()
    fetchRFQs()
  }, [])

  const handleCheckboxChange = (validatorIndex: string) => {
    setSelectedValidators(prev => {
      const newSet = new Set(prev)
      if (newSet.has(validatorIndex)) {
        newSet.delete(validatorIndex)
      } else {
        newSet.add(validatorIndex)
      }
      return newSet
    })
  }

  const handleCreateRFQ = async () => {
    if (selectedValidators.size > 0 && selectedWallet) {
      const newRFQ: CreateRFQRequest = {
        validator_indices: Array.from(selectedValidators).map(Number),
        payment_wallet_id: selectedWallet
      }

      try {
        const response = await fetch('/api/createRFQ', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            newRFQ
          })
        })

        const result = await response.json()
        if (!result.result.message) {
          toast.success('Generated new RFQ: ' + result.result.id)
        } else {
          toast.error('Response from server: ' + result.result.message)
        }
        setIsModalOpen(false)
      } catch (error) {
        toast.error('An error occurred while creating the RFQ')
      }
    }
  }

  const openWalletSelectionModal = async () => {
    const response = await fetch('/api/listWallets', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const result = await response.json()
    if (result.success) {
      setWallets(result.wallets)
      setIsModalOpen(true)
    } else {
      toast.error('Failed to fetch wallets')
    }
  }

  const calculateTotalBalance = () => {
    return validators
      .filter(v => selectedValidators.has(v.validator_index?.toString() ?? ''))
      .reduce((total, validator) => total + Number(validator.balance) / 1000000000, 0)
      .toFixed(5)
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

  const filteredValidators = validators.filter(validator =>
    selectedStatuses.has((validator.status as string)?.toLowerCase() ?? '')
  )

  const sortedValidators = filteredValidators.sort((a, b) => {
    // Prioritize "active" validators
    if ((a.status as string) === 'active' && (b.status as string) !== 'active') return -1
    if ((a.status as string) !== 'active' && (b.status as string) === 'active') return 1

    // Apply other sorting criteria if both are "active" or neither is "active"
    if (sortConfig !== null) {
      const { key, direction } = sortConfig
      const aValue = a[key as keyof ValidatorInfo]
      const bValue = b[key as keyof ValidatorInfo]
      if (aValue !== undefined && bValue !== undefined) {
        if (aValue < bValue) {
          return direction === 'ascending' ? -1 : 1
        }
        if (aValue > bValue) {
          return direction === 'ascending' ? 1 : -1
        }
      }
    }
    return 0
  })

  const indexOfLastValidator = currentPage * validatorsPerPage
  const indexOfFirstValidator = indexOfLastValidator - validatorsPerPage
  const currentValidators = sortedValidators.slice(indexOfFirstValidator, indexOfLastValidator)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const requestSort = (key: string) => {
    let direction = 'ascending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  return (
    <div className='overflow-x-auto bg-white shadow-lg rounded-lg'>
      <div className='p-3 border-b'>
        <h2 className='text-lg font-semibold text-gray-800 mb-2'>Validator Status Filter</h2>
        <div className='flex space-x-4'>
          {['active', 'activating', 'exited'].map(status => (
            <label key={status} className='inline-flex items-center'>
              <input
                type='checkbox'
                checked={selectedStatuses.has(status)}
                onChange={() => handleStatusChange(status)}
                className='form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-400'
              />
              <span className='ml-2 text-sm text-gray-700 capitalize'>{status}</span>
            </label>
          ))}
        </div>
      </div>
      <div className='p-3'>
        <div className='flex justify-center items-center h-4 mb-2'>
          {isRefreshing && <div className='loader'></div>}
        </div>
        <table className='min-w-full divide-y divide-gray-200 text-sm'>
          <thead className='bg-gray-50'>
            <tr>
              <th
                scope='col'
                className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Select
              </th>
              <th
                scope='col'
                className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                onClick={() => requestSort('validator_index')}
              >
                Validator index
              </th>
              <th
                scope='col'
                className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                onClick={() => requestSort('validator_public_key')}
              >
                Public Key
              </th>
              <th
                scope='col'
                className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                onClick={() => requestSort('status')}
              >
                Status
              </th>
              <th
                scope='col'
                className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                onClick={() => requestSort('balance')}
              >
                Balance
              </th>
              <th
                scope='col'
                className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                onClick={() => requestSort('exit_estimate.estimated_exit_time')}
              >
                Estimated exit time
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {currentValidators.map(validator => (
              <tr key={validator.validator_public_key} className='hover:bg-gray-50'>
                <td className='px-3 py-2 whitespace-nowrap'>
                  <input
                    type='checkbox'
                    checked={selectedValidators.has(validator.validator_index?.toString() ?? '')}
                    onChange={() => handleCheckboxChange(validator.validator_index?.toString() ?? '')}
                    disabled={
                      validator.status !== ('active' as string) ||
                      rfqs.some(rfq =>
                        rfq.validators.some(
                          v => v.validator_index?.toString() === validator.validator_index?.toString()
                        )
                      )
                    }
                    className='form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-400'
                  />
                </td>
                <td className='px-3 py-2 whitespace-nowrap text-xs text-gray-900'>
                  {validator.validator_index ? (
                    <a
                      href={`https://${
                        process.env.NEXT_PUBLIC_SERVER === 'test' ? 'holesky.' : ''
                      }beaconcha.in/validator/${validator.validator_index}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:text-blue-900'
                    >
                      {validator.validator_index}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className='px-3 py-2 whitespace-nowrap text-xs text-gray-500'>
                  <div className='flex items-center'>
                    <input
                      type='text'
                      value={validator.validator_public_key ?? ''}
                      readOnly
                      className='flex-grow px-1 py-0.5 text-xs border rounded text-gray-700 bg-gray-50'
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(validator.validator_public_key ?? '')
                        toast.success('Copied to clipboard')
                      }}
                      className='ml-1 text-gray-400 hover:text-gray-600 focus:outline-none'
                    >
                      <FaCopy size={12} />
                    </button>
                  </div>
                </td>
                <td className='px-3 py-2 whitespace-nowrap'>
                  <span
                    className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-medium rounded-full ${
                      (validator.status as string) === 'active'
                        ? 'bg-green-100 text-green-800'
                        : (validator.status as string) === 'activating'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {validator.status as string}
                  </span>
                </td>
                <td className='px-3 py-2 whitespace-nowrap text-xs text-gray-500'>
                  {isNaN(Number(validator.balance))
                    ? 'N/A'
                    : `${(Number(validator.balance) / 1000000000).toFixed(5)} ETH`}
                </td>
                <td className='px-3 py-2 whitespace-nowrap text-xs text-gray-500'>
                  {validator.exit_estimate?.estimated_exit_time
                    ? new Date(validator.exit_estimate.estimated_exit_time).toLocaleString()
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex justify-between items-center mt-4 p-4'>
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50'
          onClick={openWalletSelectionModal}
          disabled={selectedValidators.size === 0}
        >
          Create RFQ
        </button>
        <div>
          {Array.from({ length: Math.ceil(filteredValidators.length / validatorsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div>
          <label htmlFor='entriesPerPage' className='mr-2'>
            Entries per page:
          </label>
          <select
            id='entriesPerPage'
            value={validatorsPerPage}
            onChange={e => setValidatorsPerPage(Number(e.target.value))}
            className='p-2 border border-gray-300 rounded-md'
          >
            {[10, 20, 50, 100].map(number => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className='p-6 bg-white rounded-lg shadow-md'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-semibold text-gray-800'>
                <FaWallet className='inline-block mr-2' /> Create RFQ
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className='text-gray-500 hover:text-gray-700 transition duration-150'
              >
                <FaTimes />
              </button>
            </div>
            <p className='text-sm text-gray-600 mb-4'>
              Please select the wallet where the escrow/accepted bid will be paid out to.
            </p>

            <div className='mb-6'>
              <label htmlFor='wallet-select' className='block text-sm font-medium text-gray-700 mb-2'>
                Select Payment Wallet
              </label>
              <select
                id='wallet-select'
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                value={selectedWallet || ''}
                onChange={e => setSelectedWallet(e.target.value)}
              >
                <option value=''>Choose a wallet</option>
                {wallets.map(wallet => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.walletName} - {wallet.walletAddress}
                  </option>
                ))}
              </select>
            </div>

            <h3 className='text-lg font-semibold text-gray-800 mb-2'>Selected Validators</h3>
            <div className='max-h-60 overflow-y-auto mb-4'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Index
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Public Key
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {validators
                    .filter(v => selectedValidators.has(v.validator_index?.toString() ?? ''))
                    .map(validator => (
                      <tr key={validator.validator_public_key}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {validator.validator_index}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {validator.validator_public_key?.substring(0, 10)}...
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {(Number(validator.balance) / 1000000000).toFixed(5)} ETH
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className='text-right mb-4'>
              <span className='text-lg font-semibold text-gray-800'>Total Balance: {calculateTotalBalance()} ETH</span>
            </div>

            <div className='flex justify-end mt-6'>
              <button
                className='bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 disabled:opacity-50'
                onClick={handleCreateRFQ}
                disabled={!selectedWallet}
              >
                Create RFQ
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ValidatorsTable
