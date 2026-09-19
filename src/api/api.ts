import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173';

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