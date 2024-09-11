import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Sidebar: React.FC = () => {
  const router = useRouter()
  const activeSection = router.pathname.replace('/', '') as 'overview' | 'rfqs'
  const navItems = [
    { id: 'validators', label: 'Validators', icon: '📊', href: '/validators' },
    { id: 'rfqs', label: 'RFQs', icon: '📄', href: '/rfqs' },
    { id: 'wallets', label: 'Wallets', icon: '💼', href: '/wallets' },
    { id: 'webhooks', label: 'Webhooks', icon: '🔗', href: '/webhooks' }
  ]

  return (
    <div className='bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out'>
      <nav>
        {navItems.map(item => (
          <Link key={item.id} href={item.href}>
            <p
              className={`block py-2.5 px-4 rounded transition duration-200 ${
                activeSection === item.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'
              }`}
            >
              {item.icon} {item.label}
            </p>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
