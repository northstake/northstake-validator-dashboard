import { useEffect, useState } from 'react'
import { useApi } from '../context/ApiContext'
import { WebHookLookupAnswer } from '@northstake/northstakeapi'
import Modal from './Modal'
import WebhookForm from './WebhookForm'
import { toast } from 'react-toastify'
import { FaTrash } from 'react-icons/fa'

const WebhooksTable = () => {
  const [webhooks, setWebhooks] = useState<WebHookLookupAnswer[]>([])
  const { api } = useApi()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [addedNewWebhook, setAddedNewWebhook] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const fetchWebhooks = async () => {
      if (api) {
        if (addedNewWebhook !== false) {
          const response = await fetch('/api/listWebhooks', {
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
            setWebhooks(result.webhooks)
          } else {
            console.error(result.error)
          }
        }
        setAddedNewWebhook(false)
      }
    }
    fetchWebhooks()
  }, [api, addedNewWebhook])

  const deleteWebhook = async (webhookId: string) => {
    if (api) {
      const response = await fetch('/api/removeWebhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: api.apiKey,
          privateKey: api.privateKey,
          server: api.server,
          webhookId
        })
      })

      const result = await response.json()
      if (result.result.status === 204) {
        toast.success('Webhook deleted successfully')
        setWebhooks(webhooks.filter(webhook => webhook.id !== webhookId))
      } else {
        toast.error('Failed to delete webhook')
      }
    }
  }

  const getWebhookUrl = (url: string) => {
    if (url.includes('blobhook.com')) {
      return url.replace('api/in', 'view')
    } else if (url.includes('play.svix.com')) {
      return url.replace('/in/', '/view/')
    }
    return url
  }

  return (
    <div className='overflow-x-auto relative'>
      <button
        className='absolute top-3 right-3  bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300'
        onClick={() => setIsModalOpen(true)}
        title='Add Webhook'
      >
        <span className='text-xl font-bold'>+</span>
      </button>
      <table className='min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
      <thead className='bg-gray-900 h-12'>
          <tr>
            <th className='px-4 py-2 text-left text-gray-100'>Event Type</th>
            <th className='px-4 py-2 text-left text-gray-100'>URL</th>
            <th className='px-4 py-2 text-left text-gray-100'></th>
          </tr>
        </thead>
        <tbody>
          {webhooks.map(webhook => (
            <tr key={webhook.id} className='border-b border-gray-200 hover:bg-gray-100'>
              <td className='px-4 py-2'>{webhook.eventType}</td>
              <td className='px-4 py-2 text-sm'>
                <a
                  href={getWebhookUrl(webhook.url)}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 hover:text-blue-700 transition-colors duration-300'
                >
                  {webhook.url}
                </a>
              </td>
              <td className='px-4 py-2'>
                <button className='text-red-600 hover:text-red-800' onClick={() => deleteWebhook(webhook.id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <WebhookForm onClose={() => setIsModalOpen(false)} onWebhookAdded={setAddedNewWebhook} />
        </Modal>
      )}
    </div>
  )
}

export default WebhooksTable
