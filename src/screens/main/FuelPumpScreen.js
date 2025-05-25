// src/screens/main/FuelPumpScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Card, TextInput } from "react-native-paper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import apiService from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const { width } = Dimensions.get("window");

export default function FuelPumpScreen({ route, navigation }) {
  const { vehicle } = route.params;
  const [pumpAmount, setPumpAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Get quota balance from the vehicle data
  const quotaBalance = vehicle.quotaBalance || vehicle.currentQuota?.remainingQuota || 0;
  const maxQuota = vehicle.maxQuota || vehicle.currentQuota?.allocatedQuota || 0;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for pump button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const { user } = useAuth();
  
  const handlePumpFuel = async () => {
    const amount = parseFloat(pumpAmount);

    if (!amount || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid fuel amount");
      return;
    }

    if (amount > quotaBalance) {
      Alert.alert(
        "Insufficient Quota",
        `Cannot pump ${amount}L. Available quota: ${quotaBalance.toFixed(1)}L`
      );
      return;
    }

    setLoading(true);
    try {
      // Determine fuel price based on fuel type
      const unitPrice = vehicle.fuelType === 'DIESEL' ? 400 : 450;
      
      console.log("Vehicle fuel type:", vehicle.fuelType);
      
      const result = await apiService.pumpFuel({
        vehicleId: vehicle.vehicleId || vehicle.id,
        fuelType: vehicle.fuelType || 'PETROL', // Must match backend enum
        pumpedLiters: amount,
        unitPrice: unitPrice,
        // No remarks field - backend doesn't accept it
      });

      if (result.success) {
        Alert.alert(
          "✅ Fuel Pumped Successfully",
          `Transaction ID: ${result.data.transactionId}\n` +
            `Amount: ${result.data.pumpedLiters}L\n` +
            `Total Cost: Rs.${result.data.totalAmount}\n` +
            `Remaining Quota: ${result.data.remainingQuota}L\n\n` +
            `${
              result.data.smsSent
                ? "✉️ SMS notification sent to vehicle owner."
                : "SMS notification pending."
            }`,
          [
            {
              text: "Complete",
              onPress: () => navigation.navigate("Home"),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("❌ Error", error.message || "Failed to record fuel pump");
    } finally {
      setLoading(false);
    }
  };

  const suggestedAmounts = [5, 10, 15, 20, 25, 30].filter(
    (amount) => amount <= quotaBalance && amount > 0
  );

  const getQuotaStatusColor = () => {
    if (maxQuota === 0) return "#e94560";
    const percentage = (quotaBalance / maxQuota) * 100;
    if (percentage > 50) return "#00d25b";
    if (percentage > 20) return "#ffab00";
    return "#e94560";
  };

  const quotaColor = getQuotaStatusColor();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a2332" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fuel Pump</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            {/* Vehicle Info Card */}
            <Card style={styles.vehicleCard}>
              <View style={styles.vehicleHeader}>
                <View style={styles.vehicleIconContainer}>
                  <MaterialCommunityIcons
                    name={
                      vehicle.vehicleType === "CAR"
                        ? "car"
                        : vehicle.vehicleType === "VAN"
                        ? "van-utility"
                        : vehicle.vehicleType === "BUS"
                        ? "bus"
                        : vehicle.vehicleType === "TRUCK"
                        ? "truck"
                        : "motorbike"
                    }
                    size={32}
                    color="#fff"
                  />
                </View>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleNumber}>
                    {vehicle.vehicleNumber}
                  </Text>
                  <Text style={styles.ownerName}>{vehicle.ownerName}</Text>
                </View>
                <View style={styles.quotaBadge}>
                  <Text style={[styles.quotaValue, { color: quotaColor }]}>
                    {quotaBalance.toFixed(1)}L
                  </Text>
                  <Text style={styles.quotaLabel}>Available</Text>
                </View>
              </View>
            </Card>

            {/* Fuel Amount Input Card */}
            <Card style={styles.pumpCard}>
              <View style={styles.pumpHeader}>
                <MaterialCommunityIcons
                  name="gas-station"
                  size={24}
                  color="#e94560"
                />
                <Text style={styles.pumpTitle}>Enter Fuel Amount</Text>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  label="Fuel Amount"
                  value={pumpAmount}
                  onChangeText={setPumpAmount}
                  mode="flat"
                  keyboardType="numeric"
                  style={styles.input}
                  placeholder="0"
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
                    <TextInput.Affix
                      text="Liters"
                      textStyle={{ color: "#7a8c9e" }}
                    />
                  }
                />
              </View>

              {/* Visual Fuel Gauge */}
              {pumpAmount && parseFloat(pumpAmount) > 0 && (
                <View style={styles.gaugeContainer}>
                  <View style={styles.gauge}>
                    <View
                      style={[
                        styles.gaugeFill,
                        {
                          width: `${Math.min(
                            (parseFloat(pumpAmount) / quotaBalance) * 100,
                            100
                          )}%`,
                          backgroundColor:
                            parseFloat(pumpAmount) > quotaBalance
                              ? "#e94560"
                              : "#00d25b",
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.gaugeText}>
                    {quotaBalance > 0 
                      ? `${((parseFloat(pumpAmount) / quotaBalance) * 100).toFixed(0)}% of available quota`
                      : "No quota available"
                    }
                  </Text>
                </View>
              )}

              {/* Quick Amount Buttons */}
              {suggestedAmounts.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  <Text style={styles.suggestionsTitle}>Quick Select</Text>
                  <View style={styles.suggestionsGrid}>
                    {suggestedAmounts.map((amount) => (
                      <TouchableOpacity
                        key={amount}
                        style={styles.suggestionButton}
                        onPress={() => setPumpAmount(amount.toString())}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.suggestionText}>{amount}L</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Pump Button */}
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                  style={[
                    styles.pumpButton,
                    { opacity: !pumpAmount || loading ? 0.6 : 1 },
                  ]}
                  onPress={handlePumpFuel}
                  disabled={loading || !pumpAmount}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <>
                      <MaterialCommunityIcons
                        name="loading"
                        size={24}
                        color="#fff"
                      />
                      <Text style={styles.pumpButtonText}>Processing...</Text>
                    </>
                  ) : (
                    <>
                      <MaterialCommunityIcons
                        name="fuel"
                        size={24}
                        color="#fff"
                      />
                      <Text style={styles.pumpButtonText}>Pump Fuel</Text>
                    </>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </Card>

            {/* Info Card */}
            <Card style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Ionicons name="information-circle" size={24} color="#ffab00" />
                <Text style={styles.infoTitle}>Important Information</Text>
              </View>

              <View style={styles.infoContent}>
                {[
                  {
                    icon: "mail-outline",
                    text: "SMS notification will be sent to vehicle owner",
                  },
                  {
                    icon: "document-text-outline",
                    text: "Transaction recorded in system database",
                  },
                  {
                    icon: "refresh-outline",
                    text: "Quota balance updated automatically",
                  },
                  {
                    icon: "checkmark-circle-outline",
                    text: "Verify fuel amount before confirming",
                  },
                ].map((item, index) => (
                  <View key={index} style={styles.infoItem}>
                    <Ionicons name={item.icon} size={18} color="#7a8c9e" />
                    <Text style={styles.infoText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </Card>

            {/* Bottom Spacing */}
            <View style={{ height: 95 }} />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#1e2939",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  // Vehicle Card
  vehicleCard: {
    backgroundColor: "#253241",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  vehicleHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#e94560",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 14,
    color: "#7a8c9e",
  },
  quotaBadge: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  quotaValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  quotaLabel: {
    fontSize: 12,
    color: "#7a8c9e",
    marginTop: 2,
  },
  // Pump Card
  pumpCard: {
    backgroundColor: "#253241",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  pumpHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  pumpTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    fontSize: 24,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  // Gauge
  gaugeContainer: {
    marginBottom: 24,
  },
  gauge: {
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
  },
  gaugeFill: {
    height: "100%",
    borderRadius: 6,
  },
  gaugeText: {
    fontSize: 12,
    color: "#7a8c9e",
    textAlign: "center",
  },
  // Suggestions
  suggestionsContainer: {
    marginBottom: 24,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  suggestionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  suggestionButton: {
    backgroundColor: "rgba(233, 69, 96, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(233, 69, 96, 0.3)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 4,
  },
  suggestionText: {
    color: "#e94560",
    fontSize: 16,
    fontWeight: "600",
  },
  // Pump Button
  pumpButton: {
    backgroundColor: "#00d25b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#00d25b",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  pumpButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
    letterSpacing: 1,
  },
  // Info Card
  infoCard: {
    backgroundColor: "#253241",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 171, 0, 0.2)",
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 12,
  },
  infoContent: {
    marginLeft: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#7a8c9e",
    marginLeft: 12,
    flex: 1,
  },
});