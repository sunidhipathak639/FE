import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import Toaster from '@/components/ui/toaster' // ✅ Toast component

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster /> {/* ✅ Global Toast Notification Container */}
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
