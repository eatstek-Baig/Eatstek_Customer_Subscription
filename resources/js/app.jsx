import './bootstrap';
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './Routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './lib/contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('app')).render(
  <AuthProvider>

  <StrictMode>
    <ToastContainer />
    <AppRoutes />
  </StrictMode>
  </AuthProvider>
);