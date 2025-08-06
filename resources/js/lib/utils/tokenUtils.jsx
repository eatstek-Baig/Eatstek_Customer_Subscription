import { jwtDecode } from "jwt-decode";

let logoutTimer = null;
let idleTimer = null;
const IDLE_TIMEOUT = 5 * 60 * 1000; 

export const clearLogoutTimer = () => {
    if (logoutTimer) clearTimeout(logoutTimer);
  if (idleTimer) clearTimeout(idleTimer);
  logoutTimer = null;
  idleTimer = null;
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

export const startIdleTimer = (logoutCallback) => {
  const resetIdleTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(logoutCallback, IDLE_TIMEOUT);
  };

  // Events that indicate activity
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  
  events.forEach(event => {
    window.addEventListener(event, resetIdleTimer);
  });

  // Start initial timer
  resetIdleTimer();

  // Cleanup function
  return () => {
    events.forEach(event => {
      window.removeEventListener(event, resetIdleTimer);
    });
    clearTimeout(idleTimer);
  };
};