import { Dispatch, SetStateAction, useState } from 'react'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaWallet } from 'react-icons/fa' // Import wallet icon

const WalletForm = ({
  onClose,
  onWalletAdded
}: {
  onClose: () => void
  onWalletAdded: Dispatch<SetStateAction<boolean | undefined>>
}) => {
  const [walletName, setWalletName] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false) // Add loading state

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsLoading(true) // Start loading
    const response = await fetch('/api/registerWallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        walletName,
        walletAddress
      })
    })

    const result = await response.json()
    setIsLoading(false) // Stop loading
    if (result.success) {
      if (result.result.status === 400 && result.result.body.message === 'Wallet already exists') {
        toast.error('Wallet already exists')
      } else {
        toast.success('Wallet registered successfully')
        onWalletAdded(true) // Call the callback to refetch wallets
        setTimeout(onClose, 2000)
      }
    } else {
      console.error(result.error)
      toast.error('An error occurred while registering the wallet')
      setTimeout(onClose, 2000)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg shadow-md' style={{ minWidth: '400px' }}>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold text-gray-800 flex items-center'>
            <FaWallet className='mr-2' /> Register Wallet
          </h1>
          <button type='button' onClick={onClose} className='text-gray-500 hover:text-gray-700 transition duration-150'>
            &times;
          </button>
        </div>
        <div className='mb-4'>
          <label className='block mb-2 text-gray-700 font-medium'>Wallet Name</label>
          <input
            type='text'
            className='p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={walletName}
            onChange={e => setWalletName(e.target.value)}
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2 text-gray-700 font-medium'>Wallet Address</label>
          <input
            type='text'
            className='p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={walletAddress}
            onChange={e => setWalletAddress(e.target.value)}
            required
          />
        </div>
        <div className='flex justify-center'>
          <button
            type='submit'
            className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 disabled:opacity-50'
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? 'Registering...' : 'Register Wallet'}
          </button>
        </div>
        {isLoading && (
          <div className='flex justify-center mt-4'>
            <div className='loader'></div>
          </div>
        )}
      </form>
    </>
  )
}

export default WalletForm
