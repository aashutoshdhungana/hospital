import axios from "axios";

const api = axios.create({
    baseURL: window.location.origin,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

// Add request interceptor to include credentials
api.interceptors.request.use(
    (config) => {
        // Always include credentials
        config.withCredentials = true;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Handle specific error codes
            if (error.response.status === 401) {
                console.error("Authentication error: User is not authenticated");
            } else if (error.response.status === 400) {
                console.error("Bad request error:", error.response.data);
            }
        }
        return Promise.reject(error);
    }
);

export default api;