import axios from "axios";
import { usesAuthContext } from "../../contexts/AuthContext";

const ErrorCodeMessages = {
  401: "Unauthorized",
  403: "Access Forbidden",
  404: "Resource or page not found",
  500: "Internal Server Error",
};

export const BASE_URL = import.meta.env.VITE_APP_URL;

export const HttpService = axios.create({
   baseURL: "http://localhost:8001", // Laravel backend
  // withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});


let isRefresh = false;
let failedRequests = [];
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};  

//Http request interceptor for auth token
HttpService.interceptors.request.use(
  (config) => {
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

//Http response interceptor
HttpService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const { refreshToken, logout } = usesAuthContext();
 
    if (status === 401 && !originalRequest._retry) {
       originalRequest._retry = true;
      
      try {
        const newToken = await refreshToken();
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(ErrorCodeMessages[status] || "Something went wrong");
  }
);


export default HttpService;




