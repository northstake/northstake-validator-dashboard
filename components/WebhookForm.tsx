import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { useApi } from '../context/ApiContext'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { v4 as uuidv4 } from 'uuid' // Import UUID library
import Image from 'next/image' // Import Image component for the icon


const WebhookForm = ({
  onClose,
  onWebhookAdded
}: {
  onClose: () => void
  onWebhookAdded: Dispatch<SetStateAction<boolean | undefined>>
}) => {
  const { api } = useApi()
  const [authToken, setAuthToken] = useState('secret-key-here') // Prefill auth token
  const [url, setUrl] = useState('')
  const [webhookType, setWebhookType] = useState('RFQBidReceived') // Add webhook type state
  const [isLoading, setIsLoading] = useState(false) // Add loading state

  useEffect(() => {
    // Generate initial Blobhook URL
    setUrl(`https://blobhook.com/api/in/${uuidv4()}`)
  }, [])

  const handleRegenerateUrl = () => {
    setUrl(`https://blobhook.com/api/in/${uuidv4()}`)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (api) {
      setIsLoading(true) // Start loading
      const response = await fetch('/api/registerWebhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: api.apiKey,
          privateKey: api.privateKey,
          server: api.server,
          authToken,
          url,
          webhookType
        })
      })

      const result = await response.json()
      setIsLoading(false) // Stop loading
      if (result.success) {
        if (result.result.status === 400) {
          toast.error('Webhook already exists')
          onClose()
        } else {
          toast.success('Webhook registered successfully')
          onWebhookAdded(true)
          onClose()
        }
      } else {
        console.error(result.error)
        toast.error('An error occurred while registering the webhook')
        onClose()
      }
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <div className='flex items-center'>
            <h1 className='text-2xl font-bold'>Register Webhook</h1>
          </div>
          <div className='h-px w-full bg-gray-300 my-4'></div>
          <label className='block mb-2'>URL</label>
          <div className='relative'>
            <input
              type='text'
              className='p-2 border rounded w-full pr-10'
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
            />
            <Image
              src='/mascot_notext.png'
              alt='Mascot'
              width={24}
              height={24}
              className={`absolute right-4 top-2 cursor-pointer ${url.startsWith('https://blobhook.com/api/in') ? 'animate-float' : 'filter grayscale'}`}
              title='Powered by Blobhook'
              onClick={handleRegenerateUrl}
            />
          </div>
        </div>
        
        <div className='mb-4'>
          <label className='block mb-2'>Auth Token</label>
          <input
            type='text'
            className='p-2 border rounded w-full'
            value={authToken}
            onChange={e => setAuthToken(e.target.value)}
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Webhook Type</label>
          <select
            className='p-2 border rounded w-full'
            value={webhookType}
            onChange={e => setWebhookType(e.target.value)}
            required
          >
            <option value='RFQBidReceived'>Bid received</option>
            <option value='RFQEscrowEvent'>Escrow payment made</option>
            <option value='RFQTransferProposalReceived'>Transfer proposal received</option>
            <option value='RFQEscrowReleased'>Escrow released</option>
          </select>
        </div>
        <div className='flex justify-center'>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 disabled:opacity-50'
            disabled={isLoading || !authToken || !url || !webhookType} // Disable button while loading or if any field is empty
          >
            {isLoading ? 'Registering...' : 'Register Webhook'}
          </button>
        </div>
        {isLoading && (
          <div className='flex justify-center mt-4'>
            <div className='loader'></div>
          </div>
        )}
      </form>
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}

export default WebhookForm
