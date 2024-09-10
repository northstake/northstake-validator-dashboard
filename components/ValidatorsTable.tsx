import { useEffect, useState } from 'react'
import { useApi } from '../context/ApiContext'
import { ValidatorInfo, CreateRFQRequest, Wallet } from '@northstake/northstakeapi'
import { toast } from 'react-toastify'
import Modal from './Modal'

const ValidatorsTable = () => {
  const [validators, setValidators] = useState<ValidatorInfo[]>([])
  const [selectedValidators, setSelectedValidators] = useState<Set<string>>(new Set())
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true) // New loading state
  const { api } = useApi()

  useEffect(() => {
    const fetchValidators = async () => {
      if (api) {
        setIsLoading(true) // Start loading
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
        if (result.success) {
          setValidators(result.validators)
        } else {
          console.error(result.error)
        }
        setIsLoading(false) // End loading
      }
    }
    fetchValidators()
  }, [api])

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
    if (api && selectedValidators.size > 0 && selectedWallet) {
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
            apiKey: api.apiKey,
            privateKey: api.privateKey,
            server: api.server,
            newRFQ
          })
        })

        const result = await response.json()
        if (result.result.message != 'Validators are already being sold') {
          toast.success(result.result.message)
        } else {
          toast.error('One or more selected validators are already part of an active RFQ')
        }
        setIsModalOpen(false)
      } catch (error) {
        toast.error('An error occurred while creating the RFQ')
      }
    }
  }

  const openWalletSelectionModal = async () => {
    if (api) {
      const response = await fetch('/api/listWallets', {
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
      if (result.success) {
        setWallets(result.wallets)
        setIsModalOpen(true)
      } else {
        toast.error('Failed to fetch wallets')
      }
    }
  }

  return (
    <div className='overflow-x-auto'>
      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='loader'></div> {/* Add your loading spinner here */}
        </div>
      ) : (
        <table className='min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
          <thead className='bg-gray-200'>
            <tr>
              <th className='px-4 py-2 text-left text-gray-700'>Select</th>
              <th className='px-4 py-2 text-left text-gray-700'>Validator index</th>
              <th className='px-4 py-2 text-left text-gray-700'>Public Key</th>
              <th className='px-4 py-2 text-left text-gray-700'>Status</th>
              <th className='px-4 py-2 text-left text-gray-700'>Balance</th>
              <th className='px-4 py2 text-left text-gray-700'>Estimated exit time</th>
            </tr>
          </thead>
          <tbody>
            {validators.map(validator => (
              <tr key={validator.validator_public_key} className='border-b border-gray-200 hover:bg-gray-100'>
                <td className='px-4 py-2'>
                  <input
                    type='checkbox'
                    checked={selectedValidators.has(validator.validator_index?.toString() ?? '')}
                    onChange={() => handleCheckboxChange(validator.validator_index?.toString() ?? '')}
                  />
                </td>
                <td className='px-4 py-2'>
                  <a
                    href={`https://${api?.server === 'test' ? 'holesky.' : ''}beaconcha.in/validator/${
                      validator.validator_index
                    }`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline'
                  >
                    {validator.validator_index}
                  </a>
                </td>
                <td className='px-4 py-2'>{validator?.validator_public_key?.substring(0, 10)}...</td>
                <td className='px-4 py-2'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      (validator.status as string) === 'active'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {validator.status as string}
                  </span>
                </td>
                <td className='px-4 py-2'>{Number(validator.balance) / 1000000000} ETH</td>
                <td className='px-4 py-2'>
                  {validator.exit_estimate?.estimated_exit_time
                    ? new Date(validator.exit_estimate.estimated_exit_time).toLocaleString()
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        className='mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 float-right'
        onClick={openWalletSelectionModal}
        disabled={selectedValidators.size === 0}
      >
        Create RFQ
      </button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className='p-4'>
            <h2 className='text-lg font-bold mb-2'>Select Payment Wallet</h2>
            <h3 className='text-sm text-gray-600 mb-4'>
              This is the wallet where the escrow/accepted bid will be paid out to
            </h3>
            <ul>
              {wallets.map(wallet => (
                <li key={wallet.id} className='mb-2'>
                  <button
                    className={`w-full text-left p-2 border rounded ${
                      selectedWallet === wallet.id ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => setSelectedWallet(wallet.id)}
                  >
                    {wallet.walletName} - {wallet.walletAddress}
                  </button>
                </li>
              ))}
            </ul>
            <button
              className='mt-4 bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50'
              onClick={() => {
                handleCreateRFQ()
              }}
              disabled={!selectedWallet}
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}
    
    </div>
  )
}

export default ValidatorsTable
