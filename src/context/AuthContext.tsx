
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('carpoolUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    // Simulate authentication - in real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('carpoolUsers') || '{}');
    
    let userData: User;
    
    if (existingUsers[username]) {
      // Use existing user
      userData = existingUsers[username];
    } else {
      // Create new user
      userData = {
        id: Date.now().toString(),
        username: username
      };
      // Save new user to users registry
      existingUsers[username] = userData;
      localStorage.setItem('carpoolUsers', JSON.stringify(existingUsers));
    }
    
    setUser(userData);
    localStorage.setItem('carpoolUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('carpoolUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
