import Dashboard from './pages/Dashboard'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            fontSize: '14px',
            borderRadius: '10px',
            padding: '12px 16px',
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
        }}
      />
      <Dashboard />
    </>
  )
}

export default App
