import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../@types/auth.types";
import { envConfig } from "../config/env.config";

const API_URL = envConfig.VITE_API_URL;

export const authService = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  },

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_URL}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to get user");
    }

    return response.json();
  },
};
