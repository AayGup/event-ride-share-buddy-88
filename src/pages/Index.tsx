
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect to activities
    if (user) {
      navigate('/activities');
    }
  }, [user, navigate]);

  const handleLogin = async (username: string, password: string) => {
    await login(username, password);
    navigate('/activities');
  };

  return (
    <LoginForm 
      onLogin={handleLogin}
      onToggleMode={() => {}}
      isSignUp={false}
    />
  );
};

export default Index;
