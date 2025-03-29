// src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import AnimeDetailPage from "./pages/AnimeDetailPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./pages/ProtectedRoute";
// Import the session context hook from supertokens
import { doesSessionExist, getUserId } from "supertokens-auth-react/recipe/session";
import useHeartbeat from "./hooks/useHeartbeat";

const App: React.FC = () => {
  const [userId, setUserId] = useState<string>('non_auth_user');

  useEffect(() => {
    async function fetchUserId() {
      if (!doesSessionExist()) {
        const id = await getUserId();
        setUserId(id);
      }
    }
    fetchUserId();
  }, []);

  useHeartbeat(userId);

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