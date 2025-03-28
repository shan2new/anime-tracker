// src/components/Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { Toaster } from "@/components/ui/sonner";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-surface bg-opacity-95 backdrop-blur-sm border-b border-border">
        <NavBar />
      </header>
      <main className="max-w-7xl mx-auto">
        <Outlet />
        <Toaster />        
      </main>
      <footer className="bg-surface border-t border-border py-4 text-center text-sm">
        © {new Date().getFullYear()} Anime Tracker. All rights reserved.
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;