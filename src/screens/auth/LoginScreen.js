// src/screens/auth/LoginScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { TextInput } from "react-native-paper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const result = await login({ username, password });
      if (!result.success) {
        Alert.alert("Login Failed", result.error || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Login Failed", "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a2332" />

      {/* Background gradient effect */}
      <View style={styles.backgroundTop} />
      <View style={styles.backgroundMiddle} />
      <View style={styles.backgroundBottom} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <Animated.View
                style={[
                  styles.iconWrapper,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <MaterialCommunityIcons
                  name="gas-station"
                  size={50}
                  color="#fff"
                />
              </Animated.View>
              <Text style={styles.appName}>FuelStation Pro</Text>
              <Text style={styles.tagline}>Manage your station with ease</Text>
            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>
              <Text style={styles.welcomeText}>Welcome Back!</Text>
              <Text style={styles.subtitleText}>Login to continue</Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={22}
                  color="#e94560"
                  style={styles.inputIcon}
                />
                <TextInput
                  label="Username"
                  value={username}
                  onChangeText={setUsername}
                  mode="flat"
                  style={styles.input}
                  autoCapitalize="none"
                  placeholder="Username"
                  placeholderTextColor="#7a8c9e"
                  theme={{
                    colors: {
                      primary: "#e94560",
                      text: "#fff",
                      placeholder: "#7a8c9e",
                      background: "transparent",
                    },
                  }}
                  underlineColor="#3a4859"
                  activeUnderlineColor="#e94560"
                  textColor="#fff"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color="#e94560"
                  style={styles.inputIcon}
                />
                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  mode="flat"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#7a8c9e"
                  theme={{
                    colors: {
                      primary: "#e94560",
                      text: "#fff",
                      placeholder: "#7a8c9e",
                      background: "transparent",
                    },
                  }}
                  underlineColor="#3a4859"
                  activeUnderlineColor="#e94560"
                  textColor="#fff"
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      color="#e94560"
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    />
                  }
                />
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
                style={styles.loginButton}
              >
                <View style={styles.gradientButton}>
                  {loading ? (
                    <Text style={styles.buttonText}>LOGGING IN...</Text>
                  ) : (
                    <Text style={styles.buttonText}>LOGIN</Text>
                  )}
                </View>
              </TouchableOpacity>

              {/* Demo Credentials */}
              <View style={styles.demoContainer}>
                <Text style={styles.demoTitle}>Demo Account</Text>
                <View style={styles.demoCredentials}>
                  <View style={styles.credentialRow}>
                    <Ionicons name="person" size={16} color="#7a8c9e" />
                    <Text style={styles.demoText}> operator</Text>
                  </View>
                  <View style={styles.credentialRow}>
                    <Ionicons name="key" size={16} color="#7a8c9e" />
                    <Text style={styles.demoText}> password</Text>
                  </View>
                </View>
              </View>

              {/* Sri Lankan Flag Colors - subtle decoration */}
              <View style={styles.flagDecoration}>
                <View
                  style={[styles.flagStripe, { backgroundColor: "#ff6b00" }]}
                />
                <View
                  style={[styles.flagStripe, { backgroundColor: "#ffbe00" }]}
                />
                <View
                  style={[styles.flagStripe, { backgroundColor: "#00534e" }]}
                />
                <View
                  style={[styles.flagStripe, { backgroundColor: "#8b0000" }]}
                />
              </View>
            </View>

            {/* Bottom info */}
            <View style={styles.bottomInfo}>
              <Text style={styles.infoText}>
                Efficiently manage fuel distribution
              </Text>
              <Text style={styles.infoSubtext}>
                Supporting Sri Lanka during challenging times
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a2332",
  },
  backgroundTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: "#1a2332",
  },
  backgroundMiddle: {
    position: "absolute",
    top: height * 0.3,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: "#1e2939",
  },
  backgroundBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: "#253241",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: "#e94560",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 15,
    shadowColor: "#e94560",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: "#7a8c9e",
  },
  formContainer: {
    backgroundColor: "rgba(30, 41, 57, 0.8)",
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    elevation: 5,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 16,
    color: "#7a8c9e",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 0,
    top: 25,
    zIndex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    paddingLeft: 35,
    fontSize: 16,
  },
  eyeIcon: {
    marginTop: 15,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: "#e94560",
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 30,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#e94560",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  gradientButton: {
    backgroundColor: "#e94560",
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  demoContainer: {
    marginTop: 25,
    padding: 15,
    backgroundColor: "rgba(18, 29, 44, 0.6)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  demoTitle: {
    color: "#ff6b00",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  demoCredentials: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  credentialRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  demoText: {
    color: "#7a8c9e",
    fontSize: 14,
  },
  flagDecoration: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
    opacity: 0.3,
  },
  flagStripe: {
    width: 8,
    height: 3,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  bottomInfo: {
    alignItems: "center",
    marginTop: 30,
  },
  infoText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  infoSubtext: {
    color: "#7a8c9e",
    fontSize: 12,
    marginTop: 5,
  },
});
