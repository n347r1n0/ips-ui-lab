// frontend/src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './ui/tokens.css'; // переменные и глобалка
import './index.css';      // только @tailwind base/components/utilities

import App from './App.jsx';
import { ToastProvider } from './ui/surfaces/Toast.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>
);
