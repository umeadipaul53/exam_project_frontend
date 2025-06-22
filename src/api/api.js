import axios from "axios";
import { getToken } from "../auth/tokenStore";

const API = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://exam-project-asw4.onrender.com"
      : "http://localhost:2206", // your local backend port
  withCredentials: true, // crucial for sending cookies
});

API.interceptors.request.use((config) => {
  const token = getToken();
  console.log("Using token:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
