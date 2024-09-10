import type { AppProps } from 'next/app'
import { ApiProvider } from '../context/ApiContext'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../app/globals.css'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { config } from '@/config/wagmi'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserProvider } from '@/context/userContext'

const queryClient = new QueryClient()

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApiProvider>
      <UserProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <div className='flex h-screen bg-gray-100'>
              <Sidebar />
              <div className='flex-1 flex flex-col overflow-hidden'>
                <Header />
                <Component {...pageProps} />
                <ToastContainer style={{ zIndex: 10000 }} limit={1} />
              </div>
            </div>
          </QueryClientProvider>
        </WagmiProvider>
      </UserProvider>
    </ApiProvider>
  )
}
