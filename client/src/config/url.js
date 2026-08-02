const defaultApiUrl = import.meta.env.PROD
  ? "https://asia-bazar-api.vercel.app"
  : "http://localhost:5001";

export const BASE_URL = (import.meta.env.VITE_API_URL || defaultApiUrl).replace(/\/$/, "");
