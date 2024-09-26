import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { v4 as uuidv4 } from 'uuid' // Import UUID library
import Image from 'next/image' // Import Image component for the icon
import { FaLink } from 'react-icons/fa'


const WebhookForm = ({
  onClose,
  onWebhookAdded
}: {
  onClose: () => void
  onWebhookAdded: Dispatch<SetStateAction<boolean | undefined>>
}) => {
  const [authToken, setAuthToken] = useState('secret-key-here') // Prefill auth token
  const [url, setUrl] = useState('')
  const [selectedWebhookTypes, setSelectedWebhookTypes] = useState<string[]>([]) // Change to array
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
   
      setIsLoading(true) // Start loading
      const promises = selectedWebhookTypes.map(webhookType =>
        fetch('/api/registerWebhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({

            authToken,
            url,
            webhookType
          })
        }).then(response => response.json())
      )

      const results = await Promise.all(promises)
      setIsLoading(false) // Stop loading

      const allSuccessful = results.every(result => result.success && result.result.status !== 400)
      if (allSuccessful) {
        toast.success('Webhooks registered successfully')
        onWebhookAdded(true)
        onClose()
      } else {
        const errors = results.filter(result => !result.success || result.result.status === 400)
        if (errors.length === results.length) {
          toast.error('Failed to register webhooks')
        } else {
          toast.warning('Some webhooks were not registered')
        }
        console.error(errors)
      }
    
  }

  const handleWebhookTypeChange = (type: string) => {
    setSelectedWebhookTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg shadow-md'>
        <div className='mb-6'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-semibold text-gray-800 flex items-center'>
              <FaLink className='mr-2' /> Register Webhook
            </h1>
            <button
              type='button'
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700 transition duration-150'
            >
              &times;
            </button>
          </div>
          <div className='h-px w-full bg-gray-300 my-4'></div>
          <label className='block mb-2 text-gray-700 font-medium'>URL</label>
          <div className='relative'>
            <input
              type='text'
              className='p-3 border rounded w-full pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
            />
            <Image
              src='/mascot_notext.png'
              alt='Mascot'
              width={24}
              height={24}
              className={`absolute right-4 top-3 cursor-pointer ${url.startsWith('https://blobhook.com/api/in') ? 'animate-float' : 'filter grayscale'}`}
              title='Powered by Blobhook'
              onClick={handleRegenerateUrl}
            />
          </div>
        </div>
        
        <div className='mb-6'>
          <label className='block mb-2 text-gray-700 font-medium'>Auth Token</label>
          <input
            type='text'
            className='p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={authToken}
            onChange={e => setAuthToken(e.target.value)}
            required
          />
        </div>
        <div className='mb-6'>
          <label className='block mb-2 text-gray-700 font-medium'>Webhook Types</label>
          <div className='space-y-3'>
            {[
              { type: 'RFQBidReceived', description: 'Triggered when a new bid is received for an RFQ' },
              { type: 'RFQEscrowEvent', description: 'Triggered when there is an event related to the RFQ escrow' },
              { type: 'RFQTransferProposalReceived', description: 'Triggered when a transfer proposal is received for an RFQ' },
              { type: 'RFQEscrowReleased', description: 'Triggered when the RFQ escrow is released' }
            ].map(({ type, description }) => (
              <div key={type} className='flex items-center'>
                <input
                  type='checkbox'
                  id={type}
                  value={type}
                  checked={selectedWebhookTypes.includes(type)}
                  onChange={() => handleWebhookTypeChange(type)}
                  className='mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                />
                <label htmlFor={type} className='flex items-center text-gray-700'>
                  {type.replace('RFQ', '')}
                  <span className='text-gray-500 text-sm ml-2'>{description}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className='flex justify-center'>
          <button
            type='submit'
            className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 disabled:opacity-50'
            disabled={isLoading || !authToken || !url || selectedWebhookTypes.length === 0} // Disable button while loading or if any field is empty
          >
            {isLoading ? 'Registering...' : 'Register Webhooks'}
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
