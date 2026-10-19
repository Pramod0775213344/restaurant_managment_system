const url = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3000";
export const API = "http://localhost:3000/"

export const api = (path: string, options: RequestInit = {}) =>
    fetch(`${url}${path}`, {
        ...options,
        credentials: "include", // hama request ekatama cookie yanawa
        headers: { "Content-Type": "application/json", ...options.headers },
    });