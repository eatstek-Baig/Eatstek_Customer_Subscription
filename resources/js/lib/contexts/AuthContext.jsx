import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { clearLogoutTimer, startLogoutTimer } from "../utils/tokenUtils";
import { setGlobalLogout } from "../services/api/HttpService";

const AuthContext = createContext(undefined);

export function usesAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within a Auth Provider");
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const logout = useCallback(() => {
        clearLogoutTimer();
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/login";
    }, []);

    const login = useCallback(
        (userData) => {
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", userData.token);

            setUser(JSON.parse(localStorage.getItem("user")));

            startLogoutTimer(logout);
        },
        [logout]
    );

    useEffect(() => {

       const initializeAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      
      if (token && userData) {
        try {
            setUser(JSON.parse(userData));
            startLogoutTimer(logout);
          
        } catch (error) {
          console.error("Token validation failed:", error);
          logout();
        }
      }
    };

    initializeAuth();
    setGlobalLogout(logout);
    
    return () => {
      clearLogoutTimer();
    };
  }, [logout]);

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
};
