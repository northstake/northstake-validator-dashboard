import type { AppProps } from 'next/app'
import { ApiProvider } from '../context/ApiContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../app/globals.css'
import Sidebar from '@/components/Sidebar'

import Header from '@/components/Header'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApiProvider>
      <div className='flex h-screen bg-gray-100'>
        <Sidebar />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <Header />

          <Component {...pageProps} />
          <ToastContainer />
        </div>
      </div>
    </ApiProvider>
  )
}
