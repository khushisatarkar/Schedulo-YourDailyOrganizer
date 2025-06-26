import React from "react";
import { AuthForm } from "./components/Auth/AuthForm";
import Dashboard from "./components/Dashboard/Dashboard";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthForm />;
}

export default App;
