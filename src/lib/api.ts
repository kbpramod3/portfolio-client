import axios from "axios";
import { newStock } from "../types";

const api = axios.create({
  baseURL: "https://portfolio-server-9xg7.onrender.com/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  stocks: {
    getAll: () => api.get("api/stocks"),
  },
  portfolio: {
    getAll: () => api.get("/api/portfolio"),
    add: (stock: newStock) => api.post("/api/portfolio/add", stock),
    delete: (id: string) => api.delete(`/api/portfolio/${id}`),
  },
  // auth: {
  //   login: (credentials: any) => api.post("/api/users/login", credentials),
  //   register: (userData: any) => api.post("/api/users/register", userData),
  // },
};
