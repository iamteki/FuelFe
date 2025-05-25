// src/navigation/AuthNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/auth/LoginScreen";

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1a2332",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: "#fff",
        },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: "Fuel Station Login",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
