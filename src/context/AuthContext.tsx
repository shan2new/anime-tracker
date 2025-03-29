// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: any; // You can store user info here (for now, null)
  accessToken: string | null;
  loginWithAniList: () => void;
  logout: () => void;
  setAuthData: (token: string, user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const loginWithAniList = () => {
    const clientId = process.env.REACT_APP_ANILIST_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_ANILIST_REDIRECT_URI;
    const state = Math.random().toString(36).substring(2); // Generate a random state for CSRF protection
    // Redirect to AniList OAuth authorization endpoint
    window.location.href = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;
  };

  const setAuthData = (token: string, userData: any) => {
    setAccessToken(token);
    setUser(userData);
    // Optionally, store token in localStorage for persistence
    localStorage.setItem("anilist_access_token", token);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("anilist_access_token");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loginWithAniList, logout, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};