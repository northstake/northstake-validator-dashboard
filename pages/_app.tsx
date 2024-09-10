import type { AppProps } from 'next/app'
import { ApiProvider } from '../context/ApiContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../app/globals.css'
import Sidebar from '@/components/Sidebar'
import { useRouter } from 'next/router'
import Header from '@/components/Header'

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const activeSection = router.pathname.replace('/', '') as 'overview' | 'rfqs'

  return (
    <ApiProvider>
      <div className='flex h-screen bg-gray-100'>
        <Sidebar activeSection={activeSection} />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <Header />

          <Component {...pageProps} />
          <ToastContainer />
        </div>
      </div>
    </ApiProvider>
  )
}
