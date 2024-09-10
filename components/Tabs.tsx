'use client'
import React, { useState } from 'react'
import ListRFQDocuments from './ListRFQDocuments'
import ListWallets from './ListWallets'
import ListWebhooks from './ListWebhooks'
import ReactJson from 'react-json-view'
import ValidatorsTable from './ValidatorsTable'

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('rfqs')
  const [selectedItem, setSelectedItem] = useState<unknown | null>(null)

  const handleItemClick = async (itemId: string, fetchDetails: (id: string) => Promise<unknown>) => {
    const details = await fetchDetails(itemId)
    setSelectedItem(details)
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='tabs flex justify-center mb-4'>
        <button
          className={`px-4 py-2 mx-2 rounded ${
            activeTab === 'rfqs' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('rfqs')}
        >
          RFQs
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${
            activeTab === 'wallets' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('wallets')}
        >
          Registered Wallets
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${
            activeTab === 'webhooks' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('webhooks')}
        >
          Registered Webhooks
        </button>
      </div>
      <div className='container flex mx-auto p-4 mb-4'>
        <ValidatorsTable />
      </div>
      <div className='content flex'>
        <div className='list w-1/3 p-4 border-r-50 border-gray-300 bg-blue-100'>
          {activeTab === 'rfqs' && <ListRFQDocuments onItemClick={handleItemClick} />}
          {activeTab === 'wallets' && <ListWallets onItemClick={setSelectedItem} />}
          {activeTab === 'webhooks' && <ListWebhooks onItemClick={setSelectedItem} />}
        </div>
        <div className='main-view w-2/3 p-4'>{selectedItem !== null && <ReactJson src={selectedItem as object} />}</div>
      </div>
    </div>
  )
}

export default Tabs
