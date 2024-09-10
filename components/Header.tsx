'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useUser } from '@/context/userContext'
import { FaUserCircle, FaEthereum, FaCoins } from 'react-icons/fa'
import LogoutButton from './Logoutbutton'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { useConnect, useAccount, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { readContract } from '@wagmi/core'
import { config } from '@/config/wagmi'

const Header = () => {
  const { userInfo, contractAddress, contractABI } = useUser()
  const { connect, connectors } = useConnect()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: hash, isPending, writeContract, isError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const [server, setServer] = useState('test')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [availableRewards, setAvailableRewards] = useState<string>('0')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const depositToContract = () => {
    alert('Depositing to contract')

    writeContract({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: 'deposit',
      args: [],
      value: ethers.parseEther('32')
      
    })
  }

  const acceptExitFromContract = (proposalId: string) => {
    //we need to turn the proposalId into a bytes32
 
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: 'acceptExit',
      args: [proposalId]
    })
  }

  const collectRewardsFromContract = () => {
    return writeContract({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: 'collectRewards'
    })
  }

  useEffect(() => {
    if (isPending) {
      toast.info('Transaction sent to wallet...')
    }
  }, [isPending])

  useEffect(() => {
    if (isConfirming) {
      toast.info('Waiting for transaction confirmation on chain...')
    }
  }, [isConfirming])

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Transaction confirmed!')
    }
  }, [isConfirmed])

  useEffect(() => {
    if (isError) {
      toast.dismiss()
      toast.error('Transaction rejected in wallet!')
    }
  }, [isError])

  useEffect(() => {
    if (isConnected && contractAddress) {
      console.log('connected and contract address set to ', contractAddress)
      updateRewards()
    }
  }, [isConnected, contractAddress])

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
    try {
      let tx
      switch (selectedAction) {
        case 'deposit':
          tx = await depositToContract()
          break
        case 'acceptExit':
          const proposalId = prompt('Enter the proposal ID:')
          if (!proposalId) return
          tx = await acceptExitFromContract(proposalId)
          break
        case 'collectRewards':
          tx = await collectRewardsFromContract()
          break
      }
      console.log(tx)
      toast.success(`${selectedAction} successful!`)
      closeWalletModal()
    } catch (error) {
      console.error(`${selectedAction} failed`, error)
      if (error instanceof Error && error.message.includes('action="estimateGas"')) {
        toast.error('Please ensure your wallet is whitelisted before attempting this action.')
        return
      }
      toast.error(`${selectedAction} failed. Please try again.`)
    }
  }

  const updateRewards = async () => {
    const output = await readContract(config, {
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: 'rewards'
    })
    console.log('rewards', output)
    setAvailableRewards(ethers.formatEther(output as bigint))
  }

  const handleCollectRewards = () => {
    try {
      const result = collectRewardsFromContract()
      console.log('result', result)
    } catch (error) {
      console.error('Collect rewards failed', error)
      toast.error('Collect rewards failed. Please try again.')
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
          className={`ml-4 p-2 rounded flex items-center ${isConnected ? 'text-white' : 'text-gray-500'}`}
          onClick={() => {
            setWalletModalOpen(true)
          }}
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
            {isConnected && (
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
            {!isConnected && (
              <div className='mb-4'>
                <h3 className='text-lg font-semibold mb-2'>Connect Wallet</h3>

                <div className='space-y-2'>
                  {connectors.map(connector => (
                    <button
                      key={connector.id}
                      onClick={() => connect({ connector })}
                      className='w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                    >
                      {connector.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {isConnected && (
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
                <button
                  onClick={() => disconnect()}
                  className='w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center'
                >
                  Disconnect Wallet
                </button>
              </div>
            )}
            <button
              onClick={closeWalletModal}
              className='mt-6 w-full p-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400'
            >
              Close
            </button>
            {userInfo?.smartContracts?.[0]?.address && (
              <div className='mt-4 text-center'>
                <a
                  href={`${etherscanUrl}${userInfo.smartContracts[0].address}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 hover:text-blue-700 underline text-sm'
                >
                  View Smart Contract on Etherscan
                </a>
              </div>
            )}
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
