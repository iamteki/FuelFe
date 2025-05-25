// src/services/api.js
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL, STORAGE_KEYS, API_TIMEOUT } from "../utils/constants";

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }

          // Log requests in development
          if (__DEV__) {
            console.log(
              `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
            );
            console.log("Headers:", config.headers);
            if (config.data) {
              console.log("Data:", config.data);
            }
          }

          return config;
        } catch (error) {
          console.error("Error in request interceptor:", error);
          return config;
        }
      },
      (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        if (__DEV__) {
          console.log(`✅ API Response: ${response.config.url}`, response.data);
        }
        return response.data;
      },
      async (error) => {
        if (__DEV__) {
          console.error(
            `❌ API Error: ${error.config?.url}`,
            error.response?.data || error.message
          );
        }

        // Handle network errors
        if (!error.response) {
          console.error("Network error - no response received");
          throw new Error(
            "Network error. Please check your connection and ensure the backend is running."
          );
        }

        // Handle 401 - Token expired or invalid
        if (error.response?.status === 401) {
          await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
          await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);

          throw new Error("Session expired. Please login again.");
        }

        // Handle other errors
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          `Request failed with status ${error.response?.status}`;

        throw new Error(errorMessage);
      }
    );
  }

  /**
   * Authentication endpoint for mobile operators
   * Matches MobileApiController.mobileLogin()
   */
  async login(credentials) {
    try {
      const loginRequest = {
        usernameOrEmail: credentials.username || credentials.usernameOrEmail,
        password: credentials.password,
      };

      const response = await this.api.post("/auth/login", loginRequest);
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  /**
   * Get operator profile and fuel station details
   * Matches MobileApiController.getOperatorProfile()
   */
  async getOperatorProfile() {
    try {
      const response = await this.api.get(`/operator/profile`);
      return response;
    } catch (error) {
      console.error("Get operator profile error:", error);
      throw error;
    }
  }

  /**
   * Get today's transactions for the operator
   * Matches MobileApiController.getTodaysTransactions()
   */
  async getTodayTransactions() {
    try {
      const response = await this.api.get(`/operator/transactions/today`);
      return response;
    } catch (error) {
      console.error("Get today transactions error:", error);
      throw error;
    }
  }

  /**
   * Get operator statistics
   * Matches MobileApiController.getOperatorStats()
   */
  async getOperatorStats() {
    try {
      const response = await this.api.get(`/operator/stats`);
      return response;
    } catch (error) {
      console.error("Get operator stats error:", error);
      throw error;
    }
  }

  /**
   * Health check to verify API connection
   * Matches MobileApiController.healthCheck()
   */
  async checkHealth() {
    try {
      const response = await this.api.get(`/health`);
      return response;
    } catch (error) {
      console.error("Health check error:", error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export default apiService;
