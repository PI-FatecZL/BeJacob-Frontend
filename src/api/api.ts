import axios from "axios";
import { authService } from "../services/authService";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// configurando endpoint padrão do backend
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// configurando token de autenticação para ser usado nas requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        // Só adiciona o cabeçalho se houver token E a rota NÃO for de autenticação
        if (token && !config.url?.includes("/auth/")) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar o erro de token expirado (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      authService.logout();

      window.location.href = "/login"; 
    }

    return Promise.reject(error);
  }
);