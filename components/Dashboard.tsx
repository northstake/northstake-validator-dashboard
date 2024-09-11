'use client'

import React from 'react'
import ValidatorsTable from './ValidatorsTable'
import WebhooksTable from './WebhooksTable'
import WalletsTable from './WalletsTable'
import RFQsTable from './RFQsTable'
import { useApi } from '../context/ApiContext'
import LockScreen from './LockScreen'

const Dashboard = ({ activeSection }: { activeSection: 'validators' | 'rfqs' | 'wallets' | 'webhooks' }) => {
  const { api } = useApi()

  if (!api) {
    return <LockScreen />
  }

  return (
    <main className='main-view flex-1 overflow-x-hidden overflow-y-auto'>
      <div className='container mx-auto p-4'>
        {activeSection === 'validators' ? (
          <div className='p-4'>
            <h4 className='text-gray-700 text-lg font-medium mb-4'>Validators</h4>
            <ValidatorsTable />
          </div>
        ) : activeSection === 'rfqs' ? (
          <div className='p-4'>
            <h4 className='text-gray-700 text-lg font-medium mb-4'>Active RFQ documents</h4>
            <RFQsTable />
          </div>
        ) : activeSection === 'wallets' ? (
          <div className='p-4'>
            <h4 className='text-gray-700 text-lg font-medium mb-4'>Wallets</h4>
            <WalletsTable />
          </div>
        ) : (
          <div className='p-4'>
            <h4 className='text-gray-700 text-lg font-medium mb-4'>Webhooks</h4>
            <WebhooksTable />
          </div>
        )}
      </div>
    </main>
  )
}

export default Dashboard
