'use client'

import React from 'react'
import ValidatorsTable from './ValidatorsTable'
import WebhooksTable from './WebhooksTable'
import WalletsTable from './WalletsTable'
import RFQsTable from './RFQsTable'
import { useUser } from '../context/userContext'
import LockScreen from './LockScreen'

const Dashboard = ({ activeSection }: { activeSection: 'validators' | 'rfqs' | 'wallets' | 'webhooks' }) => {
  const { userInfo } = useUser()

  if (!userInfo) {
    return <LockScreen />
  } 

  return (
    <main className='main-view flex-1 overflow-x-hidden overflow-y-auto'>
      <div className='container mx-auto p-4'>
        {activeSection === 'validators' ? (
          <ValidatorsTable />
        ) : activeSection === 'rfqs' ? (
          <RFQsTable />
        ) : activeSection === 'wallets' ? (
          <WalletsTable />
        ) : (
          <WebhooksTable />
        )}
      </div>
    </main>
  )
}

export default Dashboard
