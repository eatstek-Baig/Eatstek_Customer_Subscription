import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AuthService from '../services/auth/AuthService';
import { clearRefreshTimer } from '../utils/tokenUtils';

const AuthContext = createContext(undefined);

export function usesAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within a Auth Provider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

          //login Authentication function
        const login = useCallback((userData) => {
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', userData.token);
          setUser(JSON.parse(localStorage.getItem('user')));
        },[]);

                const logout = useCallback(() => {
          clearRefreshTimer(); // Clear the refresh timer on logout
          setUser(null);
          localStorage.removeItem('user');
          localStorage.removeItem('token'); 
        }, []);  

                //retain the login session on refresh
        useEffect(() => {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}