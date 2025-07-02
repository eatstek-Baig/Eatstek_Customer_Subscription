import { json } from "react-router-dom";

const AUTH_TOKEN_KEY = 'eatstek_admin_token';

export const AuthStorage =  {

    getToken: () => JSON.parse(localStorage.getItem(AUTH_TOKEN_KEY)),
    setToken: (token) => localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(token)),
    clearToken: () => localStorage.removeItem(AUTH_TOKEN_KEY),
    isAuthenticated: () => !!JSON.parse(localStorage.getItem(AUTH_TOKEN_KEY)),

    setUser: () => localStorage.setItem('user', JSON.stringify(user)),
    getUser: () => JSON.parse(localStorage.getItem('user')),
}