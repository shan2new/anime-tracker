// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Session from "supertokens-web-js/recipe/session";

const ProtectedRoute: React.FC = () => {
  const [sessionExists, setSessionExists] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkSession() {
      const exists = await Session.doesSessionExist();
      setSessionExists(exists);
    }
    checkSession();
  }, []);

  if (sessionExists === null) {
    // You can replace this with a more stylish loader if desired
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!sessionExists) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;