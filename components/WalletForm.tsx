import { Dispatch, SetStateAction, useState } from 'react'
import { useApi } from '../context/ApiContext'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const WalletForm = ({
  onClose,
  onWalletAdded
}: {
  onClose: () => void
  onWalletAdded: Dispatch<SetStateAction<boolean | undefined>>
}) => {
  const { api } = useApi()
  const [walletName, setWalletName] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false) // Add loading state

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (api) {
      setIsLoading(true) // Start loading
      const response = await fetch('/api/registerWallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: api.apiKey,
          privateKey: api.privateKey,
          server: api.server,
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
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block mb-2'>Wallet Name</label>
          <input
            type='text'
            className='p-2 border rounded w-full'
            value={walletName}
            onChange={e => setWalletName(e.target.value)}
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Wallet Address</label>
          <input
            type='text'
            className='p-2 border rounded w-full'
            value={walletAddress}
            onChange={e => setWalletAddress(e.target.value)}
            required
          />
        </div>
        <div className='flex justify-center'>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300'
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
