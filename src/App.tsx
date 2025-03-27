// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import AnimeDetailPage from "./pages/AnimeDetailPage";
import Layout from "./components/Layout";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login route without NavBar */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Protected routes with NavBar via Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<LandingPage />} />
          <Route path="/anime/:id" element={<AnimeDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;