'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'manuverse_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // restore session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored) as User);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // simulate network latency
    await new Promise((r) => setTimeout(r, 800));

    if (password !== 'Admin@123') {
      throw new Error('Invalid email or password. Please try again.');
    }

    let authenticatedUser: User;

    if (email.toLowerCase() === 'admin@manuverse.com') {
      authenticatedUser = {
        id: '1',
        name: 'Rohit Jha',
        email: 'admin@manuverse.com',
        role: 'Super Admin',
        avatar: 'RJ',
      };
    } else {
      // derive name from email prefix
      const prefix = email.split('@')[0];
      const name = prefix
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const initials = name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      authenticatedUser = {
        id: '2',
        name,
        email: email.toLowerCase(),
        role: 'Plant Manager',
        avatar: initials || 'PM',
      };
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook for consuming auth
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
