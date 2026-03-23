import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { ThemeSync } from './components/ThemeSync';
import { syncHtmlThemeFromStorage } from './utils/themeHtml';
import './index.css';

// مزامنة <html> قبل React — دائماً نزيل dark إلا إذا كان المخزن = dark
syncHtmlThemeFromStorage();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeSync>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <App />
          <Toaster
            position="top-left"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 4000,
              className: 'sanad-toast',
              style: {
                background: 'var(--toast-bg, #fff)',
                color: 'var(--toast-fg, #1f2937)',
                borderRadius: '12px',
                boxShadow:
                  '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid var(--toast-border, #e5e7eb)',
                padding: '16px',
                fontFamily: 'Cairo, Tajawal, Arial, sans-serif',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
                style: {
                  borderLeft: '4px solid #10b981',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
                style: {
                  borderLeft: '4px solid #ef4444',
                },
              },
              loading: {
                iconTheme: {
                  primary: '#0284c7',
                  secondary: '#fff',
                },
              },
            }}
          />
        </BrowserRouter>
      </ThemeSync>
    </QueryClientProvider>
  </React.StrictMode>,
);

