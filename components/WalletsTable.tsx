import { useEffect, useState } from 'react'
import { useApi } from '../context/ApiContext'
import { Wallet } from '@northstake/northstakeapi'
import Modal from './Modal'
import WalletForm from './WalletForm'
import { toast } from 'react-toastify'
import { FaTrash } from 'react-icons/fa'

const WalletsTable = () => {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const { api } = useApi()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [addedNewWallet, setAddedNewWallet] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const fetchWallets = async () => {
      if (api) {
        if (addedNewWallet !== false) {
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
          } else {
            console.error(result.error)
          }
        }
        setAddedNewWallet(false)
      }
    }
    fetchWallets()
  }, [api, addedNewWallet])

  const deleteWallet = async (walletId: string) => {
    if (api) {
      const response = await fetch('/api/removeWallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: api.apiKey,
          privateKey: api.privateKey,
          server: api.server,
          walletId
        })
      })

      const result = await response.json()
      if (result.result.status === 204) {
        toast.success('Wallet deleted successfully')
        setWallets(wallets.filter(wallet => wallet.id !== walletId))
      } else {
        toast.error('Failed to delete wallet')
      }
    }
  }

  const confirmDeleteWallet = (walletId: string) => {
    if (window.confirm('Are you sure you want to delete this wallet? ' + walletId)) {
      deleteWallet(walletId)
    }
  }

  const shortenAddress = (address: string, chars = 6) => {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`
  }

  const getEtherscanLink = (address: string) => {
    const baseUrl = api?.server === 'test' ? 'https://holesky.etherscan.io/address/' : 'https://etherscan.io/address/'
    return `${baseUrl}${address}`
  }

  return (
    <div className='overflow-x-auto relative'>
      <button
        className='absolute top-3 right-3 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300'
        onClick={() => setIsModalOpen(true)}
        title='Add Wallet'
      >
        <span className='text-xl font-bold'>+</span>
      </button>
      <table className='min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
      <thead className='bg-gray-900 h-12'>
          <tr>
            <th className='px-4 py-2 text-left text-gray-100'>Wallet id</th>
            <th className='px-4 py-2 text-left text-gray-100'>Wallet Address</th>

            <th className='px-4 py-2 text-left text-gray-100'></th>
          </tr>
        </thead>
        <tbody>
          {wallets.map(wallet => (
            <tr key={wallet.id} className='border-b border-gray-200 hover:bg-gray-100'>
              <td className='px-4 py-2'>{wallet.walletName}</td>
              <td className='px-4 py-2 text-sm text-blue-500'>
                <a href={getEtherscanLink(wallet.walletAddress)} target='_blank' rel='noopener noreferrer'>
                  {shortenAddress(wallet.walletAddress)}
                </a>
              </td>

              <td className='px-4 py-2 text-end'>
                <button className='text-red-600 hover:text-red-800' onClick={() => confirmDeleteWallet(wallet.id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <WalletForm onClose={() => setIsModalOpen(false)} onWalletAdded={setAddedNewWallet} />
        </Modal>
      )}
    </div>
  )
}

export default WalletsTable
