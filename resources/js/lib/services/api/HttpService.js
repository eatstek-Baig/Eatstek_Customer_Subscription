import axios from "axios";
import { AuthStorage } from "../../utils/AuthStorage";

const ErrorCodeMessages = {
  401: "Unauthorized",
  403: "Access Forbidden",
  404: "Resource or page not found",
  500: "Internal Server Error",
};

export const BASE_URL = import.meta.env.VITE_APP_URL;

export const HttpService = axios.create({
   baseURL: "http://127.0.0.1:8000", // Laravel backend
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

//Http request interceptor for auth token
HttpService.interceptors.request.use(
  (config) => {
    const token = AuthStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Http response interceptor
HttpService.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // if(error.response?.staus === 401 && !originalRequest._retry){
    //   originalRequest._retry = true
    //   try{
    //     const newToken = await refreshToken();
    //     AuthStorage.setToken(newToken);
    //     return HttpService(originalRequest);
    //   }catch(error){
    //     AuthStorage.clearToken();
    //     window.location.href = "/login";
    //     return Promise.reject(error);
    //   }
    // }

    if (error.response?.status === 401) {
      AuthStorage.clearToken();
      window.location.href = "/login";
    }
    
  
    const errorCode = error.response?.status;
    const errorMessage = ErrorCodeMessages[errorCode] || "Something went wrong";
    return Promise.reject(errorMessage);
  }
);


export default HttpService;