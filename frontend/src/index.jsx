import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/common/ErrorBoundary'
import { AuthProvider } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'
import { ChatProvider } from './context/ChatContext'
import { ToastProvider } from './hooks/useToast'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <BookingProvider>
              <ChatProvider>
                <App />
              </ChatProvider>
            </BookingProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
