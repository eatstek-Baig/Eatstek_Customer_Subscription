import { createContext, useContext, useState, useEffect } from 'react';
import { AuthStorage } from './AuthStorage';
import { AuthService } from './AuthService';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(AuthStorage.getUser());

    useEffect(() => {
    const unsubscribe = AuthStorage.subscribe(() => {
      setUser(AuthStorage.getUser());
    });
    return unsubscribe;
  }, []);

   const value = {
    user,
    login: AuthService.login,
    logout: AuthService.logout,
    isAuthenticated: !!AuthStorage.getToken()
  };
  
  return <AuthContext.Provider value={value}> {children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);