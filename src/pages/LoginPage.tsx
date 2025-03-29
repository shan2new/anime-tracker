// src/pages/LoginPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Session from "supertokens-web-js/recipe/session";
import { signIn } from "supertokens-auth-react/recipe/emailpassword";
import { Input } from "@/components/ui/input";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkSession() {
      if (await Session.doesSessionExist()) {
        navigate("/");
      }
    }
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await signIn({
        formFields: [
          { id: "email", value: email },
          { id: "password", value: password },
        ],
      });
      if (response.status === "OK") {
        navigate("/");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An error occurred during sign in.");
      console.error("Sign in error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/animetracker_bg.png')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="xs:my-12 relative z-10 md:w-full max-w-md space-y-8 p-10 bg-opacity-20 backdrop-blur-3xl rounded-lg shadow-lg animate-fadeIn">
        <div className="flex justify-center">
          <img src="/login_logo.png" alt="Anime Tracker Logo" className="h-64 w-auto" />
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-2">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm transition-all duration-300"
                placeholder="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-sm transition-all duration-300"
                placeholder="password"
              />
            </div>
          </div>
          {error && (
            <p className="mt-2 text-center text-sm text-red-500">{error}</p>
          )}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-all duration-300 ${
                loading
                  ? "bg-gray-400"
                  : "bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;