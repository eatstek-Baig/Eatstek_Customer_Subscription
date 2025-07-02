import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './Routes';

// function App(){
//     return <h1 className="text-3xl font-bold text-center text-blue-600 mt-10">
//     Hello React + Laravel 12!
//     </h1>
// }

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);