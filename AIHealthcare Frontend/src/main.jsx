import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              border: '1px solid #DBEAFE',
              padding: '12px 14px',
              color: '#1E3A8A',
              background: '#FFFFFF',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#2563EB',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#1E40AF',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
