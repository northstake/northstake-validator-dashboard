'use client'

import React from 'react'
import ValidatorsTable from './ValidatorsTable'
import WebhooksTable from './WebhooksTable'
import WalletsTable from './WalletsTable'
import RFQsTable from './RFQsTable'
import { useApi } from '../context/ApiContext'
import LockScreen from './LockScreen'

const Dashboard = ({ activeSection }: { activeSection: 'overview' | 'rfqs' }) => {
  const { api } = useApi()

  if (!api) {
    return <LockScreen />
  }

  return (
    <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-200'>
      <div className='container mx-auto p-4'>
        {activeSection === 'overview' ? (
          <div className='space-y-2'>
            <div className='p-4'>
              <h4 className='text-gray-700 text-lg font-medium mb-4'>Validators</h4>
              <ValidatorsTable />
            </div>
            <div className='flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8'>
              <div className='w-full lg:w-1/3  p-4'>
                <h4 className='text-gray-700 text-lg font-medium mb-4'>Wallets</h4>
                <WalletsTable />
              </div>
              <div className='w-full lg:w-2/3  p-4'>
                <h4 className='text-gray-700 text-lg font-medium mb-4'>Webhooks</h4>
                <WebhooksTable />
              </div>
            </div>
          </div>
        ) : (
          <div className=' p-4'>
            <h4 className='text-gray-700 text-lg font-medium mb-4'>Active RFQ documents</h4>
            <RFQsTable />
          </div>
        )}
      </div>
    </main>
  )
}

export default Dashboard
