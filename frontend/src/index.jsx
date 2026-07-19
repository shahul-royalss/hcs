import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/common/ErrorBoundary'
import { AuthProvider } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'
import { ChatProvider } from './context/ChatContext'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './hooks/useToast'
import { initAnalytics } from './utils/analytics'
import './index.css'

initAnalytics()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <ToastProvider>
            <AuthProvider>
              <BookingProvider>
                <ChatProvider>
                  <App />
                </ChatProvider>
              </BookingProvider>
            </AuthProvider>
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
