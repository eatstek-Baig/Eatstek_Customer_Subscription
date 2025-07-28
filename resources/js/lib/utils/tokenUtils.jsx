import { jwtDecode } from "jwt-decode";

let logoutTimer = null;

export const clearLogoutTimer = () => {
    if (logoutTimer) {
        clearTimeout(logoutTimer);
        logoutTimer = null;
    }
};

export const startLogoutTimer = (logoutCallback) => {
    clearLogoutTimer();
    
    const token = localStorage.getItem("token");
    
    if (!token) {
        logoutCallback?.();
        return;
    }
    
    try {
        const { exp } = jwtDecode(token);
        const expiresIn = exp * 1000 - Date.now();

        if (expiresIn <= 0) {
            logoutCallback?.();
            return;
        }

        logoutTimer = setTimeout(() => {
            logoutCallback?.();
        }, expiresIn);
    } catch (error) {
        logoutCallback?.();
    }
};