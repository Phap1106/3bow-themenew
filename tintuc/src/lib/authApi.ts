// src/lib/authApi.ts
import { apiGet, apiPost } from "./adminApi";

export const me = () => apiGet("/auth/me");
export const logout = () => apiPost("/auth/logout");
