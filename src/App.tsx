// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import AnimeDetailPage from "./pages/AnimeDetailPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./pages/ProtectedRoute";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login route without NavBar */}
        <Route path="/login" element={<LoginPage />} />
        {/* Protected routes with NavBar via Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/anime/:id" element={<AnimeDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;