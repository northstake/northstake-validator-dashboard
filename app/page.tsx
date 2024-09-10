import { ToastContainer } from 'react-toastify'
import { ApiProvider } from '../context/ApiContext'
import Dashboard from '@/components/Dashboard'

export default function Home() {
  return (
    <ApiProvider>
       
      <Dashboard />
      <ToastContainer />
    </ApiProvider>
  )
}
