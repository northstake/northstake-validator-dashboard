'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useApi } from '../context/ApiContext'
import { AccountEntity } from '@northstake/northstakeapi'
import { FaUserCircle } from 'react-icons/fa'
import LogoutButton from './Logoutbutton'

const Header = () => {
  const { api } = useApi()
  const [userInfo, setUserInfo] = useState<AccountEntity | null>(null)
  const [server, setServer] = useState('test')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (api) {
        try {
          const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              apiKey: api.apiKey,
              privateKey: api.privateKey,
              server: api.server,
            }),
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

  const handleServerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setServer(e.target.value)
  }

  const etherscanUrl = server === 'test' ? 'https://holesky.etherscan.io/address/' : 'https://etherscan.io/address/'
  return (
    <div className='bg-gray-900 text-white p-4 flex items-center justify-between'>
      <div className='flex items-center'>
        <span className='font-bold text-lg'>Northstake Dashboard</span>
        <select
          className='ml-4 p-2 bg-gray-700 text-white rounded'
          value={server}
          onChange={handleServerChange}
        >
          <option value='localhost'>Localhost</option>
          <option value='test'>Test</option>
          <option value='production'>Production</option>
        </select>
      </div>
      <div className='relative' ref={dropdownRef}>
        {userInfo && (
          <button
            className='flex items-center focus:outline-none'
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaUserCircle className='text-2xl' />
          </button>
        )}
        {dropdownOpen && (
          <div className='absolute right-0 mt-2 w-56 bg-white text-black rounded-lg shadow-lg py-2'>
            <p className='px-4 py-2 border-b border-gray-200 text-sm'>{`${userInfo?.email}`}</p>
            <p className='px-4 py-2 border-b border-gray-200 text-sm'>{`API Key: ${api?.apiKey}`}</p>
            <p className='px-4 py-2 text-sm'>
              <a
                href={`${etherscanUrl}${userInfo?.smartContracts?.[0].address}`}
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
    </div>
  )
}

export default Header