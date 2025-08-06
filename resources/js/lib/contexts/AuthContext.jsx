import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { clearLogoutTimer, startLogoutTimer, startIdleTimer } from "../utils/tokenUtils";
// import { setGlobalLogout } from "../services/api/HttpService";
import AuthService from "../services/auth/AuthService"

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
    }, []);

    const idle_token_Logout = useCallback(async () => {
           
           try {
          await AuthService.logout() 
          console.log("Automatic logout: API success");
        } catch (err) {
          console.error("Automatic logout API error:", err);
        } finally {
              clearLogoutTimer();
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        }
        }, []);

    const login = useCallback(
        (userData) => {
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", userData.token);

            setUser(JSON.parse(localStorage.getItem("user")));

             startLogoutTimer(idle_token_Logout);
            startIdleTimer(idle_token_Logout);
        },
        []
    );

    useEffect(() => {

       const initializeAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      
      if (token && userData) {
        try {
            setUser(JSON.parse(userData));
            startLogoutTimer(idle_token_Logout);
            startIdleTimer(idle_token_Logout)
          
        } catch (error) {
          console.error("Token validation failed:", error);
          idle_token_Logout();
        }
      }
    };

    initializeAuth();
    // setGlobalLogout(idle_token_Logout);
    
    return () => {
      clearLogoutTimer();
    };
  }, [idle_token_Logout]);

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                idle_token_Logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
