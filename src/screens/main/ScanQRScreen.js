// src/screens/main/ScanQRScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
  Dimensions,
  Animated,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Card } from "react-native-paper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import apiService from "../../services/api";

const { width, height } = Dimensions.get("window");

// Import Camera with error handling
let Camera, CameraView, useCameraPermissions;
try {
  const expoCameraModule = require("expo-camera");
  Camera = expoCameraModule.Camera;
  CameraView = expoCameraModule.CameraView;
  useCameraPermissions = expoCameraModule.useCameraPermissions;
} catch (error) {
  console.warn("expo-camera not available:", error);
}

export default function ScanQRScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions
    ? useCameraPermissions()
    : [null, null];
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const [torch, setTorch] = useState(false);
  const cameraRef = useRef(null);

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Check if camera module is available
    setCameraAvailable(!!Camera && !!CameraView && !!useCameraPermissions);

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for scan area
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Scan line animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  const handleBarCodeScanned = async ({ type, data }) => {
  if (scanned) return;

  setScanned(true);
  setLoading(true);

  // Haptic feedback if available - Fixed version
  try {
    const Haptics = require("expo-haptics");
    if (Haptics && Haptics.impactAsync) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  } catch (e) {
    // Haptics not available, continue without it
    console.log("Haptics not available");
  }

  try {
    const result = await apiService.scanQR(data);
    if (result.success) {
      navigation.navigate("VehicleDetails", { vehicle: result.data });
    } else {
      throw new Error(result.message || "Could not find vehicle");
    }
  } catch (error) {
    Alert.alert(
      "Vehicle Not Found",
      error.message ||
        "The scanned QR code is not valid or the vehicle is not registered.",
      [{ text: "OK", onPress: () => setScanned(false) }]
    );
  } finally {
    setLoading(false);
  }
};
  const handleTestQR = async (qrCode) => {
    setLoading(true);
    try {
      const result = await apiService.scanQR(qrCode);
      if (result.success) {
        navigation.navigate("VehicleDetails", { vehicle: result.data });
      } else {
        throw new Error(result.message || "Could not find vehicle");
      }
    } catch (error) {
      Alert.alert(
        "Vehicle Not Found",
        error.message || "The vehicle is not found or the QR code is invalid",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
  };

  const toggleTorch = () => {
    setTorch(!torch);
  };

  // If camera is not available, show test interface only
  if (!cameraAvailable) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a2332" />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>QR Scanner</Text>
          <View style={{ width: 44 }} />
        </View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <Card style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <MaterialCommunityIcons
                name="camera-off"
                size={48}
                color="#e94560"
              />
            </View>
            <Text style={styles.infoTitle}>Camera Not Available</Text>
            <Text style={styles.infoText}>
              The camera scanner is not available on this device or simulator.
              You can test the app using the mock QR codes below.
            </Text>
          </Card>

          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>Test Vehicle QR Codes</Text>
            <View style={styles.testGrid}>
              {[
                { code: "QR123456", vehicle: "CBB-1234", type: "Car" },
                { code: "QR123457", vehicle: "CAA-5678", type: "Van" },
                { code: "QR123458", vehicle: "WP-9012", type: "Bike" },
              ].map((item, index) => (
                <TouchableOpacity
                  key={item.code}
                  style={styles.testCard}
                  onPress={() => handleTestQR(item.code)}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <View style={styles.testCardIcon}>
                    <MaterialCommunityIcons
                      name={
                        item.type === "Car"
                          ? "car"
                          : item.type === "Van"
                          ? "van-utility"
                          : "motorbike"
                      }
                      size={24}
                      color="#fff"
                    />
                  </View>
                  <Text style={styles.testCardTitle}>{item.vehicle}</Text>
                  <Text style={styles.testCardSubtitle}>{item.type}</Text>
                  <View style={styles.testCardButton}>
                    <Text style={styles.testCardButtonText}>Test Scan</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e94560" />
          <Text style={styles.loadingText}>Loading camera...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a2332" />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>QR Scanner</Text>
          <View style={{ width: 44 }} />
        </View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <Card style={styles.permissionCard}>
            <View style={styles.permissionIconContainer}>
              <MaterialCommunityIcons
                name="shield-lock"
                size={64}
                color="#e94560"
              />
            </View>
            <Text style={styles.permissionTitle}>
              Camera Permission Required
            </Text>
            <Text style={styles.permissionText}>
              To scan QR codes and verify vehicles, please allow camera access
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermission}
              activeOpacity={0.8}
            >
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
          </Card>

          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>Test Without Camera</Text>
            <View style={styles.testGrid}>
              {[
                { code: "QR123456", vehicle: "CBB-1234", type: "Car" },
                { code: "QR123457", vehicle: "CAA-5678", type: "Van" },
                { code: "QR123458", vehicle: "WP-9012", type: "Bike" },
              ].map((item) => (
                <TouchableOpacity
                  key={item.code}
                  style={styles.testCard}
                  onPress={() => handleTestQR(item.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.testCardIcon}>
                    <MaterialCommunityIcons
                      name={
                        item.type === "Car"
                          ? "car"
                          : item.type === "Van"
                          ? "van-utility"
                          : "motorbike"
                      }
                      size={24}
                      color="#fff"
                    />
                  </View>
                  <Text style={styles.testCardTitle}>{item.vehicle}</Text>
                  <Text style={styles.testCardSubtitle}>{item.type}</Text>
                  <View style={styles.testCardButton}>
                    <Text style={styles.testCardButtonText}>Test</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <CameraView
        ref={cameraRef}
        style={styles.scanner}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "code128", "code39", "code93", "ean13", "ean8"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        enableTorch={torch}
      />

      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.scannerHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.scannerBackButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.scannerHeaderTitle}>Scan Vehicle QR</Text>
          <TouchableOpacity
            style={[styles.flashButton, torch && styles.flashButtonActive]}
            onPress={toggleTorch}
          >
            <Ionicons
              name={torch ? "flash" : "flash-outline"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Scan Area */}
        <View style={styles.scanContainer}>
          <Animated.View
            style={[styles.scanArea, { transform: [{ scale: pulseAnim }] }]}
          >
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [
                    {
                      translateY: scanLineAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 240],
                      }),
                    },
                  ],
                },
              ]}
            />
          </Animated.View>

          <Text style={styles.instructionText}>
            Position the QR code within the frame
          </Text>
          <Text style={styles.subInstructionText}>
            Scanning will happen automatically
          </Text>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          {scanned ? (
            <TouchableOpacity
              style={styles.scanAgainButton}
              onPress={resetScanner}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <>
                  <ActivityIndicator color="#fff" />
                  <Text style={styles.scanAgainText}>Processing...</Text>
                </>
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="qrcode-scan"
                    size={24}
                    color="#fff"
                  />
                  <Text style={styles.scanAgainText}>Scan Again</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Ready to Scan</Text>
            </View>
          )}

          {/* Test buttons */}
          <View style={styles.testButtonsContainer}>
            <Text style={styles.testButtonsTitle}>Quick Test:</Text>
            <View style={styles.testButtonsRow}>
              {["QR123456", "QR123457", "QR123458"].map((code, index) => (
                <TouchableOpacity
                  key={code}
                  style={styles.miniTestButton}
                  onPress={() => handleTestQR(code)}
                  activeOpacity={0.7}
                  disabled={loading}
                >
                  <MaterialCommunityIcons
                    name="qrcode"
                    size={16}
                    color="#e94560"
                  />
                  <Text style={styles.miniTestButtonText}>
                    Test {index + 1}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a2332",
  },
  scanner: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight + 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#1e2939",
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a2332",
  },
  loadingIcon: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#7a8c9e",
    marginTop: 20,
  },
  // Permission Card
  permissionCard: {
    backgroundColor: "#253241",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  permissionIconContainer: {
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  permissionText: {
    fontSize: 16,
    color: "#7a8c9e",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: "#e94560",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Info Card
  infoCard: {
    backgroundColor: "#253241",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "rgba(233, 69, 96, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#7a8c9e",
    textAlign: "center",
    lineHeight: 22,
  },
  // Test Section
  testSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  testGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  testCard: {
    width: (width - 48) / 3,
    backgroundColor: "#253241",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  testCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#e94560",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  testCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  testCardSubtitle: {
    fontSize: 12,
    color: "#7a8c9e",
    marginBottom: 12,
  },
  testCardButton: {
    backgroundColor: "rgba(233, 69, 96, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  testCardButtonText: {
    fontSize: 12,
    color: "#e94560",
    fontWeight: "600",
  },
  // Scanner Overlay
  scannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight + 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  scannerBackButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(10px)",
  },
  scannerHeaderTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  flashButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(10px)",
  },
  flashButtonActive: {
    backgroundColor: "rgba(233, 69, 96, 0.5)",
  },
  scanContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#e94560",
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 16,
  },
  scanLine: {
    position: "absolute",
    width: "100%",
    height: 3,
    backgroundColor: "#e94560",
    opacity: 0.8,
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  instructionText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 30,
    fontWeight: "600",
  },
  subInstructionText: {
    color: "#7a8c9e",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  // Bottom Controls
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: 125,
  },
  scanAgainButton: {
    backgroundColor: "#e94560",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  scanAgainText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "rgba(0, 210, 91, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00d25b",
    marginRight: 8,
    shadowColor: "#00d25b",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  statusText: {
    color: "#00d25b",
    fontSize: 16,
    fontWeight: "500",
  },
  testButtonsContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 16,
    padding: 16,
    backdropFilter: "blur(10px)",
  },
  testButtonsTitle: {
    color: "#7a8c9e",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  testButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  miniTestButton: {
    backgroundColor: "rgba(233, 69, 96, 0.2)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(233, 69, 96, 0.3)",
  },
  miniTestButtonText: {
    color: "#e94560",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
});
