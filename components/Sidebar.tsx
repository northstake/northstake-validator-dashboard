import React from 'react'

interface SidebarProps {
  activeSection: 'overview' | 'rfqs'
  setActiveSection: (section: 'overview' | 'rfqs') => void
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'rfqs', label: 'RFQs', icon: '📄' }
  ]

  return (
    <div className='bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out'>
      <nav>
        {navItems.map(item => (
          <a
            key={item.id}
            href='#'
            className={`block py-2.5 px-4 rounded transition duration-200 ${
              activeSection === item.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'
            }`}
            onClick={() => setActiveSection(item.id as 'overview' | 'rfqs')}
          >
            {item.icon} {item.label}
          </a>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
