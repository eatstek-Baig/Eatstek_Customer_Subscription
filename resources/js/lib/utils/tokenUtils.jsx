import {jwtDecode} from "jwt-decode";
import axios from "axios";

let refreshTimer = null;

// Function to clear the refresh timer
export const clearRefreshTimer = () => {
    if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
    }
};

export const getTokenExpiration = (token) => {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000;
};

export const startRefreshTimer = (token) => {
    if (!token) {
        return;
      }
    
    const expirationTime = getTokenExpiration(token);
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;


    //refresh the token 1 minute before the expiration
    const refreshThershold = 60 * 1000;

    if (timeUntilExpiration > refreshThershold) {

        refreshTimer = setTimeout(() => {
            refreshToken();
        }, timeUntilExpiration - refreshThershold);

    }
};

export const refreshToken = async () => {
    try {
        const response = await axios.post(
            `auth/api/refresh`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${
                        localStorage.getItem("token")
                    }`,
                },
            }
        );

        const newToken = response.data.token;
        localStorage.setItem("token", newToken);

        //Restart the refresh timer for the new token
        startRefreshTimer(newToken);
        return newToken;
    } catch (error) {
        console.error("Failed to refresh the token", error);
        throw error;
    }
};

// Initialize the refresh timer when the app loads
const token = localStorage.getItem("token");
if (token) {
  startRefreshTimer(token);
}
