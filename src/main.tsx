// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { WatchListProvider } from './context/WatchListContext';
import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

SuperTokens.init({
  appInfo: {
    appName: "Anime Tracker",
    apiDomain: import.meta.env.VITE_API_DOMAIN || "http://localhost:3001",
    websiteDomain: import.meta.env.VITE_WEBSITE_DOMAIN || "http://localhost:5173",
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    EmailPassword.init(), // Initialize EmailPassword recipe
    Session.init(),        // Initialize session recipe
  ],
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <WatchListProvider>
        <div>
          <App />
        </div>
      </WatchListProvider>
  </React.StrictMode>
);