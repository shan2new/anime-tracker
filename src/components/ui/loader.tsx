// src/components/ui/loader.tsx
import React, { useEffect, useState } from "react";

const Loader: React.FC = () => {
  const messages = [
    "Loading anime details...",
    "Fetching the latest episodes...",
    "Almost there..."
  ];
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 animate-fadeIn">
      <svg
        className="w-16 h-16 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <defs>
          <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="url(#spinner-gradient)"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="url(#spinner-gradient)"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
      <p className="mt-4 text-xl font-semibold tracking-wide text-muted-foreground">
        {messages[messageIndex]}
      </p>
    </div>
  );
};

export { Loader };