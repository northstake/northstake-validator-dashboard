import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { HiChartBar, HiDocumentText, HiCreditCard, HiLink } from 'react-icons/hi'

const Sidebar: React.FC = () => {
  const router = useRouter()
  const activeSection = router.pathname.replace('/', '')
  const navItems = [
    { id: 'validators', label: 'Validators', icon: HiChartBar, href: '/validators' },
    { id: 'rfq', label: 'RFQs', icon: HiDocumentText, href: '/rfq' },
    { id: 'wallets', label: 'Wallets', icon: HiCreditCard, href: '/wallets' },
    { id: 'webhooks', label: 'Webhooks', icon: HiLink, href: '/webhooks' }
  ]

  return (
    <div className='bg-gray-900 text-gray-300 w-64 h-full shadow-lg'>
      <div className='p-5 border-b border-gray-700'>
        <h1 className='text-2xl font-semibold text-white'>Dashboard</h1>
      </div>
      <nav className='mt-5'>
        {navItems.map(item => (
          <Link key={item.id} href={item.href}>
            <div
              className={`flex items-center px-6 py-3 cursor-pointer transition-colors duration-200 ${
                activeSection === item.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className='w-5 h-5 mr-3' />
              <span className='font-medium'>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
