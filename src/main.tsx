// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { WatchListProvider } from './context/WatchListContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <WatchListProvider>
        <div>
          <App />
        </div>
      </WatchListProvider>
    </AuthProvider>
  </React.StrictMode>
);