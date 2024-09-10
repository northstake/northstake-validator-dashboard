'use client'

import React, { useState } from 'react'
import ValidatorsTable from './ValidatorsTable'
import Sidebar from './Sidebar'
import WebhooksTable from './WebhooksTable'
import WalletsTable from './WalletsTable'
import RFQsTable from './RFQsTable'
import { useApi } from '../context/ApiContext'
import LockScreen from './LockScreen'
import Header from './Header'

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'rfqs'>('overview')
  const { api } = useApi()

  if (!api) {
    return <LockScreen />
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className='flex-1 flex flex-col overflow-hidden'>
      <Header />
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-200'>
          <div className='container mx-auto px-6 py-8'>
           
            {activeSection === 'overview' ? (
              <div className='space-y-8'>
                <div className='bg-white shadow rounded-lg p-4'>
                  <h4 className='text-gray-700 text-lg font-medium mb-4'>Validators</h4>
                  <ValidatorsTable />
                </div>
                <div className='flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8'>
                  <div className='w-full lg:w-1/3 bg-white shadow rounded-lg p-4'>
                    <h4 className='text-gray-700 text-lg font-medium mb-4'>Wallets</h4>
                    <WalletsTable />
                  </div>
                  <div className='w-full lg:w-2/3 bg-white shadow rounded-lg p-4'>
                    <h4 className='text-gray-700 text-lg font-medium mb-4'>Webhooks</h4>
                    <WebhooksTable />
                  </div>
                </div>
              </div>
            ) : (
              <div className='bg-white shadow rounded-lg p-4'>
                <h4 className='text-gray-700 text-lg font-medium mb-4'>Active RFQ documents</h4>
                <RFQsTable />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
