// src/services/auth.js
import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "../utils/constants";

export const authService = {
  async storeAuthData(token, userData) {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
      await SecureStore.setItemAsync(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(userData)
      );
    } catch (error) {
      console.error("Error storing auth data:", error);
      throw error;
    }
  },

  async getAuthData() {
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      const userDataString = await SecureStore.getItemAsync(
        STORAGE_KEYS.USER_DATA
      );
      const userData = userDataString ? JSON.parse(userDataString) : null;

      return { token, userData };
    } catch (error) {
      console.error("Error getting auth data:", error);
      return { token: null, userData: null };
    }
  },

  async clearAuthData() {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error("Error clearing auth data:", error);
      throw error;
    }
  },

  async isAuthenticated() {
    const { token } = await this.getAuthData();
    return !!token;
  },
};
