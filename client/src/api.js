import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const API = axios.create({
    baseURL: `${API_BASE_URL}/api`,
});

export const getCreditDashboard = async () => {
    const response = await API.get("/credit/dashboard");
    return response.data;
};