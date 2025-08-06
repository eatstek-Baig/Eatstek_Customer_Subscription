import axios from "axios";

// let globalLogout = () => console.warn("Logout function not initialized yet");

// export const setGlobalLogout = (logoutFn) => {
//   globalLogout = logoutFn;
// };

const ErrorCodeMessages = {
  401: "Unauthorized",
  403: "Access Forbidden",
  404: "Resource or page not found",
  500: "Internal Server Error",
};

export const BASE_URL = import.meta.env.VITE_APP_URL;

export const HttpService = axios.create({
   baseURL: "https://subs.eatstekltd.co.uk", 
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

HttpService.interceptors.request.use(
  (config) => {
        console.log('1. I am here')

    const token = localStorage.getItem('token');

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

HttpService.interceptors.response.use(
  (response) => response,
  async (error) => {

    // const status = error.response?.status;
    // const isLoginRequest = error.config?.url?.includes('/auth/login');
 
    // if ((status === 401 || !localStorage.getItem('token')) && !isLoginRequest) {
    //   try {
    //   await globalLogout();
     
    //   } catch (refreshError) {
    //     console.error("Logout failed:", err);
    //     // Force cleanup if logout fails
    //     localStorage.removeItem("token");
    //     localStorage.removeItem("user");
    //     window.location.href = "/login";
    //   }
    //   return Promise.reject('Session expired');
    // }
    
    return Promise.reject(ErrorCodeMessages[status] || "Something went wrong");
  }
);


export default HttpService;