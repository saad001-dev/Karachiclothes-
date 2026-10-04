import axios from "axios";

const API_URL = "https://karachi-clothes.vercel.app";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

export default api;
