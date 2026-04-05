/**
 * GigShield API Service
 * All calls go to the Node.js backend (never exposes API keys to the browser).
 */

const BASE_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:3001";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WeatherData {
  temp: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  isRaining: boolean;
  city: string;
  aqi: number | null;
  visibility: number | null;
  icon: string;
}

export interface LocationData {
  city: string;
  zone: string;
  pincode: string;
  state?: string;
  country?: string;
  road?: string;
}

// ✅ NEW: Proper response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  devOtp?: string;
  fallback?: boolean;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  return response.json();
}

// ─── OTP ──────────────────────────────────────────────────────────────────────

export const sendOtp = (phone: string) =>
  apiFetch("/api/otp/send", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });

export const verifyOtp = (phone: string, otp: string) =>
  apiFetch("/api/otp/verify", {
    method: "POST",
    body: JSON.stringify({ phone, otp }),
  });

// ─── GPS / Location ───────────────────────────────────────────────────────────

export const detectLiveLocation = (): Promise<LocationData | null> => {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      apiFetch<LocationData>("/api/location/reverse")
        .then((res) => resolve(res.success && res.data ? res.data : null))
        .catch(() => resolve(null));
      return;
    }

    const timeout = setTimeout(() => {
      apiFetch<LocationData>("/api/location/reverse")
        .then((res) => resolve(res.success && res.data ? res.data : null))
        .catch(() => resolve(null));
    }, 12000);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        clearTimeout(timeout);
        try {
          const res = await apiFetch<LocationData>(
            `/api/location/reverse?lat=${coords.latitude}&lon=${coords.longitude}`
          );
          resolve(res.success && res.data ? res.data : null);
        } catch {
          resolve(null);
        }
      },
      async () => {
        clearTimeout(timeout);
        try {
          const res = await apiFetch<LocationData>(
            "/api/location/reverse"
          );
          resolve(res.success && res.data ? res.data : null);
        } catch {
          resolve(null);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  });
};

export const getCurrentCoords = (): Promise<
  { lat: number; lon: number } | null
> => {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({ lat: coords.latitude, lon: coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  });
};

// ─── WEATHER (🔥 FIXED) ───────────────────────────────────────────────────────

// ✅ IMPORTANT CHANGE: return full response (NOT just WeatherData)
export const fetchLiveWeather = async (
  lat: number,
  lon: number
): Promise<ApiResponse<WeatherData>> => {
  try {
    const res = await apiFetch<WeatherData>(
      `/api/weather?lat=${lat}&lon=${lon}`
    );
    return res;
  } catch {
    return {
      success: false,
      error: "Weather fetch failed",
    };
  }
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminLogin = (password: string) =>
  apiFetch("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });

// ─── Users ────────────────────────────────────────────────────────────────────

import { User } from "../types";

export const registerUserDB = (user: User) =>
  apiFetch<User>("/api/users", {
    method: "POST",
    body: JSON.stringify(user),
  });

export const getUserByPhone = (phone: string) =>
  apiFetch<User>(`/api/users/phone/${phone}`);

export const updateUserDB = (userId: string, updates: Partial<User>) =>
  apiFetch<User>(`/api/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });

export const getAllUsersDB = () =>
  apiFetch<User[]>("/api/users");

// ─── Claims ───────────────────────────────────────────────────────────────────

export interface ClaimPayload {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  date: string;
  reason: string;
  status: string;
  type: string;
  city: string;
}

export const createClaimDB = (claim: ClaimPayload) =>
  apiFetch<ClaimPayload>("/api/claims", {
    method: "POST",
    body: JSON.stringify(claim),
  });

export const getUserClaimsDB = (userId: string) =>
  apiFetch<ClaimPayload[]>(`/api/claims/user/${userId}`);

export const getAllClaimsDB = () =>
  apiFetch<ClaimPayload[]>("/api/claims");