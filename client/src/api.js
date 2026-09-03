import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5001/api",
});

export const getCreditDashboard = async () => {
    const response = await API.get("/credit/dashboard");
    return response.data;
};