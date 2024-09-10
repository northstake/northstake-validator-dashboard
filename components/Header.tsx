'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useApi } from '../context/ApiContext'
import { AccountEntity } from '@northstake/northstakeapi'
import { FaUserCircle, FaEthereum, FaCoins } from 'react-icons/fa'
import LogoutButton from './Logoutbutton'
import { Eip1193Provider, ethers } from 'ethers'
import { toast } from 'react-toastify'

// Declare global ethereum property
declare global {
  interface Window {
    ethereum?: Eip1193Provider
  }
}

// ABI of the smart contract
const contractABI = [
  {
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'proposalId', type: 'bytes32' }],
    name: 'acceptExit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'collectRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'rewards',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
]

const Header = () => {
  const { api } = useApi()

  const [userInfo, setUserInfo] = useState<AccountEntity | null>(null)
  const [server, setServer] = useState('test')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false)
  const [availableRewards, setAvailableRewards] = useState<string>('0')

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (api) {
        try {
          const response = await fetch('/api/user', {
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
          const data = await response.json()
          setUserInfo(data.user)
        } catch (error) {
          console.error('Failed to fetch user information', error)
        }
      }
    }
    fetchUserInfo()
  }, [api])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const connectToMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        setIsMetaMaskConnected(true)

        const contractAddress = userInfo?.smartContracts?.[0]?.address
        if (contractAddress) {
          const contract = new ethers.Contract(contractAddress, contractABI, signer)
          setContract(contract)
          await updateRewards(contract)
        }
      } catch (error) {
        console.error('Failed to connect to MetaMask', error)
        toast.error('Failed to connect to MetaMask. Please try again.')
      }
    } else {
      toast.error('Please install MetaMask!')
    }
  }

  const handleWalletButtonClick = () => {
    if (!isMetaMaskConnected) {
      connectToMetaMask()
    } else {
      setWalletModalOpen(true)
    }
  }

  const handleServerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setServer(e.target.value)
  }

  const etherscanUrl = server === 'test' ? 'https://holesky.etherscan.io/address/' : 'https://etherscan.io/address/'

  const openWalletModal = (action: string) => {
    setSelectedAction(action)
    setWalletModalOpen(true)
  }

  const closeWalletModal = () => {
    setWalletModalOpen(false)
    setSelectedAction(null)
  }

  const handleWalletAction = async () => {
    if (!contract) return

    try {
      let tx
      switch (selectedAction) {
        case 'deposit':
          tx = await contract.deposit({ value: ethers.parseEther('32') })
          break
        case 'acceptExit':
          const proposalId = prompt('Enter the proposal ID:')
          if (!proposalId) return
          tx = await contract.acceptExit(proposalId)
          break
        case 'collectRewards':
          tx = await contract.collectRewards()
          break
      }
      await tx.wait()
      toast.success(`${selectedAction} successful!`)
      closeWalletModal()
    } catch (error) {
      console.error(`${selectedAction} failed`, error)

      // Check if the error message contains the specific string
      if (error instanceof Error && error.message.includes('action="estimateGas"')) {
        toast.error('Please ensure your wallet is whitelisted before attempting this action.')
        return
      }

      toast.error(`${selectedAction} failed. Please try again.`)
    }
  }

  const updateRewards = async (contract: ethers.Contract) => {
    try {
      const rewards = await contract.rewards()
      setAvailableRewards(ethers.formatEther(rewards))
    } catch (error) {
      console.error('Failed to fetch rewards', error)
    }
  }
  const handleCollectRewards = async () => {
    if (contract) {
      try {
        const tx = await contract.collectRewards()
        await tx.wait()
        toast.success('Rewards collected successfully!')
        await updateRewards(contract)
      } catch (error) {
        console.error('Collect rewards failed', error)
        toast.error('Collect rewards failed. Please try again.')
      }
    }
  }

  return (
    <div className='bg-gray-900 text-white p-4 flex items-center justify-between'>
      <div className='flex items-center'>
        <span className='font-bold text-lg'>Northstake Dashboard</span>
        <select className='ml-4 p-2 bg-gray-700 text-white rounded' value={server} onChange={handleServerChange}>
          <option value='localhost'>Localhost</option>
          <option value='test'>Test</option>
          <option value='production'>Production</option>
        </select>
      </div>
      <div className='flex items-center'>
        <button
          className={`ml-4 p-2 rounded flex items-center ${isMetaMaskConnected ? 'text-white' : 'text-gray-500'}`}
          onClick={handleWalletButtonClick}
        >
          <FaEthereum className='text-2xl' />
        </button>
        {userInfo && (
          <div className='relative ml-4' ref={dropdownRef}>
            <button className='flex items-center focus:outline-none' onClick={() => setDropdownOpen(!dropdownOpen)}>
              <FaUserCircle className='text-2xl' />
            </button>
            {dropdownOpen && (
              <div className='absolute right-0 mt-2 w-56 bg-white text-black rounded-lg shadow-lg py-2'>
                <p className='px-4 py-2 border-b border-gray-200 text-sm'>{`${userInfo?.email}`}</p>
                <p className='px-4 py-2 border-b border-gray-200 text-sm'>{`API Key: ${api?.apiKey}`}</p>
                <p className='px-4 py-2 text-sm'>
                  <a
                    href={`${etherscanUrl}${userInfo?.smartContracts?.[0]?.address}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-500 hover:text-blue-700 underline'
                  >
                    Smart Contract
                  </a>
                </p>
                <div className='flex justify-center'>
                  <LogoutButton />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {walletModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white text-black rounded-lg shadow-lg p-6 w-96'>
            {isMetaMaskConnected && (
              <div className='flex items-center justify-between mb-4' title='Available Rewards'>
                <div className='flex items-center'>
                  <FaCoins className='text-yellow-400 mr-2' />
                  <span className='font-semibold'>{parseFloat(availableRewards).toFixed(4)} ETH</span>
                </div>
                <button
                  onClick={handleCollectRewards}
                  className='bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-2 flex items-center'
                  title='Withdraw Rewards'
                >
                  <FaCoins className='text-lg' />
                  <span className='ml-2'>Withdraw</span>
                </button>
              </div>
            )}
            <h2 className='text-2xl font-bold mb-6'>Wallet Actions</h2>
            <div className='space-y-4'>
              <button
                onClick={() => openWalletModal('deposit')}
                className='w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center'
              >
                <FaEthereum className='mr-2' />
                <span>Deposit 32 ETH (new validator)</span>
              </button>
              <button
                onClick={() => openWalletModal('acceptExit')}
                className='w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center'
              >
                <FaEthereum className='mr-2' />
                <span>Accept exit proposal</span>
              </button>
            </div>
            <button
              onClick={closeWalletModal}
              className='mt-6 w-full p-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400'
            >
              Close
            </button>
          </div>
        </div>
      )}

      {selectedAction && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white text-black rounded-lg shadow-lg p-6 w-80'>
            <h2 className='text-xl font-bold mb-4'>{selectedAction}</h2>
            <p className='mb-4'>Submit {selectedAction} transaction?</p>
            <div className='flex justify-between'>
              <button onClick={handleWalletAction} className='p-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                Confirm
              </button>
              <button onClick={closeWalletModal} className='p-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400'>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
