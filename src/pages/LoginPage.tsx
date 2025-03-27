// src/pages/LoginPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Session from "supertokens-web-js/recipe/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { signIn } from "supertokens-auth-react/recipe/emailpassword";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Prevent accessing login page if a session already exists.
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
    try {
      const response = await signIn({
        formFields: [
          { id: "email", value: email },
          { id: "password", value: password },
        ],
      });
      console.log("SignIn response:", response);
      if (response.status === "OK") {
        navigate("/");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An error occurred during sign in.");
      console.error("Sign in error", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <Card className="w-full max-w-md bg-surface shadow-lg rounded-lg">
        <CardContent className="space-y-6 p-6">
          <h1 className="text-3xl font-bold text-center">Login</h1>
          {error && <p className="text-destructive text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="block text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="block text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary-dark transition">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;