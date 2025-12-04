import axios from "axios";

export const api = axios.create({
  baseURL: "https://sistema-cobrancas-backend.onrender.com",
});

// Adiciona token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
