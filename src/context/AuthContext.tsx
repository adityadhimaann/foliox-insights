import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AuthModal from '../components/AuthModal';

interface User {
  email: string;
  username: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  openLogin: () => void;
  openSignup: () => void;
  closeAuth: () => void;
  logout: () => void;
  setAuth: (user: User, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'login'
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('foliox_user');
    const savedToken = localStorage.getItem('foliox_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const openLogin = () => setModalState({ isOpen: true, mode: 'login' });
  const openSignup = () => setModalState({ isOpen: true, mode: 'signup' });
  const closeAuth = () => setModalState({ isOpen: false, mode: 'login' });

  const setAuth = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem('foliox_user', JSON.stringify(newUser));
    localStorage.setItem('foliox_token', newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('foliox_user');
    localStorage.removeItem('foliox_token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoggedIn: !!token, 
      openLogin, 
      openSignup, 
      closeAuth, 
      logout,
      setAuth 
    }}>
      {children}
      <AuthModal 
        isOpen={modalState.isOpen} 
        onClose={closeAuth} 
        initialMode={modalState.mode} 
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
