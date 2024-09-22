'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useUser } from '@/context/userContext'
import { FaUserCircle, FaEthereum, FaCoins, FaBell, FaCheckCircle, FaDollarSign, FaFileContract, FaHandHoldingUsd, FaUnlockAlt, FaExchangeAlt, FaSignOutAlt, FaTimes, FaWallet } from 'react-icons/fa'
import LogoutButton from './Logoutbutton'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { useConnect, useAccount, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { readContract } from '@wagmi/core'
import { config } from '@/config/wagmi'
import Image from 'next/image'
import { useRFQ } from '@/context/RFQContext'
import Link from 'next/link'

const Header = () => {
  const { userInfo, contractAddress, contractABI } = useUser()
  const { connect, connectors } = useConnect()
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: hash, isPending, writeContract, isError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })
  const { rfqs } = useRFQ()

  const [server, setServer] = useState('test')
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const notificationDropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [availableRewards, setAvailableRewards] = useState<string>('0')

  const iconMapping = {
    'accepted_quote': <FaCheckCircle className='text-green-500' />,
    'new_quote': <FaCheckCircle className='text-green-500' />,
    'escrow_payment': <FaDollarSign className='text-yellow-500' />,
    'exit_proposal': <FaFileContract className='text-blue-500' />,
    'withdrawal_recipient_settlement': <FaHandHoldingUsd className='text-green-500' />,
    'escrow_released': <FaUnlockAlt className='text-red-500' />
  }

  const actionableRFQs = rfqs.filter(rfq => {
    const hasAcceptableQuote = rfq.status.toLowerCase() === 'active' && !rfq.best_quote && !rfq.settlement_steps?.accepted_quote
    const hasExitProposal = rfq.settlement_steps?.exit_proposal && !rfq.settlement_steps?.withdrawal_recipient_settlement
    return hasAcceptableQuote || hasExitProposal
  })

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen)
    setUserDropdownOpen(false)
  }

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen)
    setNotificationDropdownOpen(false)
  }

  const depositToContract = () => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: 'deposit',
      args: [],
      value: ethers.parseEther('32')
    })
  }

  const acceptExitFromContract = (proposalId: string) => {
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

  const handleClickOutside = (event: MouseEvent) => {
    if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
      setNotificationDropdownOpen(false)
    }
    if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
      setUserDropdownOpen(false)
    }
  }

  useEffect(() => {
    if (notificationDropdownOpen || userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [notificationDropdownOpen, userDropdownOpen])

  return (
    <div className='bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-2 pr-6 pl-3 flex items-center justify-between'>
      <div className='flex items-center space-x-4'>
        <div className='flex items-center'>
          <Image 
            src='/northstake_2.png' 
            alt='Northstake' 
            width={48} 
            height={48} 
            className='h-12 w-12 transition-transform duration-300 hover:scale-110'
          />
        </div>
        <div className='flex flex-col'>
          <span className='font-bold text-xl text-white tracking-wide'>Northstake</span>
          <span className='text-sm text-gray-300 uppercase tracking-wider'>Validator Marketplace</span>
        </div>
      </div>
      <div className='flex items-center'>
        {actionableRFQs.length > 0 && (
          <div className='relative' ref={notificationDropdownRef}>
            <FaBell className='text-2xl text-yellow-400 cursor-pointer' onClick={toggleNotificationDropdown} />
            <span className='absolute top-0 right-0 inline-block w-3 h-3 bg-red-600 rounded-full'></span>
            {notificationDropdownOpen && (
              <div className='absolute right-0 mt-2 w-72 bg-white text-black rounded-lg shadow-lg py-2 z-50'>
                {actionableRFQs.map(rfq => (
                  <Link key={rfq.id} href={`/rfq?expand=${rfq.id}`} passHref legacyBehavior>
                    <a className='block px-4 py-2 hover:bg-gray-200 flex items-center'>
                      {iconMapping[rfq.status === 'active' && !rfq.settlement_steps?.accepted_quote ? 'new_quote' : 'exit_proposal']}
                      <span className='ml-2 font-semibold'>
                        {rfq.status === 'active' && !rfq.settlement_steps?.accepted_quote
                          ? `New quote available`
                          : `New exit proposal available`}
                      </span>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
        <button
          className={`ml-4 p-2 rounded flex items-center ${isConnected ? 'text-white' : 'text-gray-500'}`}
          onClick={() => {
            setWalletModalOpen(true)
          }}
        >
          <FaEthereum className='text-2xl' />
        </button>
        {userInfo && (
          <div className='relative ml-4' ref={userDropdownRef}>
            <button className='flex items-center focus:outline-none' onClick={toggleUserDropdown}>
              <FaUserCircle className='text-2xl' />
            </button>
            {userDropdownOpen && (
              <div className='absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-xl py-2 border border-gray-200'>
                <div className='px-4 py-3 border-b border-gray-200'>
                  <p className='text-sm font-medium text-gray-600'>Signed in as</p>
                  <p className='text-sm font-bold truncate'>{userInfo?.email}</p>
                </div>
                <div className='px-4 py-2'>
                  <a
                    href={`${etherscanUrl}${userInfo?.smartContracts?.[0]?.address}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center text-sm text-gray-700 hover:bg-gray-100 px-2 py-2 rounded-md transition-colors duration-150'
                  >
                    <FaFileContract className="mr-2" />
                    View Smart Contract
                  </a>
                </div>
                <div className='px-4 py-2'>
                  <label className='block text-xs font-medium text-gray-600 mb-1'>Server</label>
                  <select
                    className='w-full p-2 bg-gray-100 text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    value={server}
                    onChange={handleServerChange}
                  >
                    <option value='localhost'>Localhost</option>
                    <option value='test'>Test</option>
                    <option value='production'>Production</option>
                  </select>
                </div>
                <div className='px-4 py-2 mt-2 border-t border-gray-200'>
                  <LogoutButton />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

{walletModalOpen && (
  <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
    <div className='bg-white text-gray-800 rounded-lg shadow-xl p-6 w-96 max-w-md'>
      {isConnected && (
        <div className='flex items-center justify-between mb-6 pb-4 border-b border-gray-200'>
          <div className='flex items-center' title='Available Rewards'>
            <FaCoins className='text-yellow-500 mr-2' />
            <span className='font-semibold'>{parseFloat(availableRewards).toFixed(4)} ETH</span>
          </div>
          <button
            onClick={handleCollectRewards}
            className='bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-2 flex items-center transition-colors duration-150'
            title='Withdraw Rewards'
          >
            <FaCoins className='text-sm' />
            <span className='ml-2 text-sm'>Withdraw</span>
          </button>
        </div>
      )}
      <h2 className='text-2xl font-bold mb-6'>Wallet Actions</h2>
      {!isConnected ? (
        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-3'>Connect Wallet</h3>
          <div className='space-y-2'>
            {connectors.map(connector => (
              <button
                key={connector.id}
                onClick={() => connect({ connector })}
                className='w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150 flex items-center justify-center'
              >
                <FaWallet className='mr-2' />
                {connector.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className='space-y-4 mb-6'>
          <button
            onClick={() => openWalletModal('deposit')}
            className='w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center transition-colors duration-150'
          >
            <FaEthereum className='mr-2' />
            <span>Deposit 32 ETH (new validator)</span>
          </button>
          <button
            onClick={() => openWalletModal('acceptExit')}
            className='w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center transition-colors duration-150'
          >
            <FaExchangeAlt className='mr-2' />
            <span>Accept exit proposal</span>
          </button>
          <button
            onClick={() => disconnect()}
            className='w-full p-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center justify-center transition-colors duration-150'
          >
            <FaSignOutAlt className='mr-2' />
            Disconnect Wallet
          </button>
        </div>
      )}
      <button
        onClick={closeWalletModal}
        className='w-full p-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors duration-150'
      >
        <FaTimes className='mr-2' />
        Close
      </button>
      {userInfo?.smartContracts?.[0]?.address && (
        <div className='mt-4 text-center'>
          <a
            href={`${etherscanUrl}${userInfo.smartContracts[0].address}`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 hover:text-blue-700 underline text-sm flex items-center justify-center'
          >
            <FaFileContract className='mr-2' />
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