// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "../utils/constants";
import apiService from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);

      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));

        // Verify that API is working
        try {
          await apiService.checkHealth();
        } catch (error) {
          console.log("Health check failed, but continuing with cached auth");
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await apiService.login({
        usernameOrEmail: credentials.username,
        password: credentials.password,
      });

      console.log("Login response received:", response);

      if (response && response.success && response.data) {
        const loginData = response.data;
        
        // Backend sends 'accessToken' not 'token'
        const token = loginData.accessToken || loginData.token;
        
        if (!token) {
          throw new Error("No access token received from server");
        }

        // Create user data from the response
        const userData = {
          id: loginData.userId,
          username: loginData.username,
          email: loginData.email,
          name: loginData.username, // Use username as name for now
          role: loginData.role,
        };

        // Store auth data
        await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
        await SecureStore.setItemAsync(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(userData)
        );

        setIsAuthenticated(true);
        setUser(userData);

        // Try to get operator profile for more details
        try {
          const profileResponse = await apiService.getOperatorProfile();
          console.log("Profile response:", profileResponse);
          
          if (profileResponse && profileResponse.success && profileResponse.data) {
            const profileData = profileResponse.data;
            const enhancedUserData = {
              ...userData,
              operatorId: profileData.operatorId,
              operatorName: profileData.operatorName,
              employeeId: profileData.employeeId,
              stationName: profileData.fuelStationName,
              stationId: profileData.fuelStationId,
              fuelStationName: profileData.fuelStationName,
              fuelStationAddress: profileData.fuelStationAddress,
              isActive: profileData.isActive,
            };

            await SecureStore.setItemAsync(
              STORAGE_KEYS.USER_DATA,
              JSON.stringify(enhancedUserData)
            );

            setUser(enhancedUserData);
          }
        } catch (profileError) {
          console.log("Could not fetch operator profile, continuing with basic data");
        }

        return { success: true };
      } else {
        return {
          success: false,
          error: response?.message || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login error in AuthContext:", error);
      return {
        success: false,
        error: error.message || "Authentication failed",
      };
    }
  };

  const logout = async () => {
    try {
      // Clear secure storage
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);

      // Update state
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};