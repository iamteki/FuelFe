// src/screens/main/VehicleDetailsScreen.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Platform,
} from "react-native";
import { Card } from "react-native-paper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function VehicleDetailsScreen({ route, navigation }) {
  const { vehicle } = route.params;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

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

    // Animate progress bar - Calculate based on current quota if available
    const quotaPercentage = vehicle.currentQuota
      ? vehicle.currentQuota.remainingQuota /
        vehicle.currentQuota.allocatedQuota
      : 0;

    Animated.timing(progressAnim, {
      toValue: quotaPercentage,
      duration: 1000,
      delay: 300,
      useNativeDriver: false,
    }).start();
  }, [vehicle]);

  const handleProceedToPump = () => {
    // Pass the full vehicle data including ID
    const vehicleData = {
      ...vehicle,
      id: vehicle.vehicleId || vehicle.id, // Handle both field names
      quotaBalance: vehicle.currentQuota?.remainingQuota || 0,
      maxQuota: vehicle.currentQuota?.allocatedQuota || 0,
    };
    navigation.navigate("FuelPump", { vehicle: vehicleData });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#00d25b";
      case "suspended":
        return "#ffab00";
      case "blocked":
        return "#e94560";
      default:
        return "#7a8c9e";
    }
  };

  const getQuotaStatus = () => {
    if (!vehicle.currentQuota) {
      return { color: "#e94560", text: "No Quota", icon: "alert-circle" };
    }

    const percentage =
      (vehicle.currentQuota.remainingQuota /
        vehicle.currentQuota.allocatedQuota) *
      100;
    if (percentage > 50)
      return { color: "#00d25b", text: "Good", icon: "checkmark-circle" };
    if (percentage > 20)
      return { color: "#ffab00", text: "Low", icon: "warning" };
    return { color: "#e94560", text: "Critical", icon: "alert-circle" };
  };

  const quotaStatus = getQuotaStatus();
  const quotaPercentage = vehicle.currentQuota
    ? (vehicle.currentQuota.remainingQuota /
        vehicle.currentQuota.allocatedQuota) *
      100
    : 0;

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  const vehicleInfo = [
    {
      icon: "person-outline",
      label: "Owner",
      value: vehicle.ownerName || "N/A",
      color: "#00a8ff",
    },
    {
      icon: "call-outline",
      label: "Contact",
      value: vehicle.ownerPhone || "N/A",
      color: "#00cfe8",
    },
    {
      icon: "car-outline",
      label: "Type",
      value: vehicle.vehicleType || "N/A",
      color: "#8b80f9",
    },
    {
      icon: "calendar-outline",
      label: "Last Filled",
      value: formatDate(vehicle.lastPumpDate),
      color: "#ffab00",
    },
  ];

  // Determine vehicle status based on available data
  const vehicleStatus = vehicle.status || (vehicle.isVerified ? 'active' : 'inactive');

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
        <Text style={styles.headerTitle}>Vehicle Details</Text>
        <View style={{ width: 44 }} />
      </View>

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
          {/* Vehicle Card */}
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
                  size={40}
                  color="#fff"
                />
              </View>
              <View style={styles.vehicleHeaderInfo}>
                <Text style={styles.vehicleNumber}>
                  {vehicle.vehicleNumber}
                </Text>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(vehicleStatus) },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(vehicleStatus) },
                    ]}
                  >
                    {vehicleStatus.charAt(0).toUpperCase() + vehicleStatus.slice(1)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Info Grid */}
            <View style={styles.infoGrid}>
              {vehicleInfo.map((info, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.infoItem}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.infoIconContainer,
                      { backgroundColor: info.color + "20" },
                    ]}
                  >
                    <Ionicons name={info.icon} size={20} color={info.color} />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>{info.label}</Text>
                    <Text style={styles.infoValue}>{info.value}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Quota Card */}
          <Card style={styles.quotaCard}>
            <View style={styles.quotaHeader}>
              <Text style={styles.quotaTitle}>Fuel Quota Status</Text>
              <View
                style={[
                  styles.quotaStatusBadge,
                  { backgroundColor: quotaStatus.color + "20" },
                ]}
              >
                <Ionicons
                  name={quotaStatus.icon}
                  size={16}
                  color={quotaStatus.color}
                />
                <Text
                  style={[styles.quotaStatusText, { color: quotaStatus.color }]}
                >
                  {quotaStatus.text}
                </Text>
              </View>
            </View>

            {/* Circular Progress */}
            <View style={styles.circularProgressContainer}>
              <View style={styles.circularProgress}>
                <Animated.View
                  style={[
                    styles.progressCircle,
                    { backgroundColor: quotaStatus.color + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.progressPercentage,
                      { color: quotaStatus.color },
                    ]}
                  >
                    {quotaPercentage.toFixed(0)}%
                  </Text>
                  <Text style={styles.progressLabel}>Available</Text>
                </Animated.View>
              </View>

              <View style={styles.quotaDetails}>
                {vehicle.currentQuota ? (
                  <>
                    <View style={styles.quotaDetailRow}>
                      <Text style={styles.quotaDetailLabel}>Available</Text>
                      <Text
                        style={[
                          styles.quotaDetailValue,
                          { color: quotaStatus.color },
                        ]}
                      >
                        {vehicle.currentQuota.remainingQuota.toFixed(1)}L
                      </Text>
                    </View>
                    <View style={styles.quotaDetailRow}>
                      <Text style={styles.quotaDetailLabel}>Allocated</Text>
                      <Text style={styles.quotaDetailValue}>
                        {vehicle.currentQuota.allocatedQuota.toFixed(1)}L
                      </Text>
                    </View>
                    <View style={styles.quotaDetailRow}>
                      <Text style={styles.quotaDetailLabel}>Used</Text>
                      <Text style={styles.quotaDetailValue}>
                        {(
                          vehicle.currentQuota.allocatedQuota -
                          vehicle.currentQuota.remainingQuota
                        ).toFixed(1)}
                        L
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.noQuotaMessage}>
                    <Text style={styles.noQuotaText}>No active quota</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                      }),
                      backgroundColor: quotaStatus.color,
                    },
                  ]}
                />
              </View>
            </View>
          </Card>

          {/* Action Card */}
          <Card style={styles.actionCard}>
            {vehicle.canPumpFuel ? (
              <TouchableOpacity
                style={styles.proceedButton}
                onPress={handleProceedToPump}
                activeOpacity={0.8}
              >
                <View style={styles.proceedIconContainer}>
                  <MaterialCommunityIcons
                    name="gas-station"
                    size={24}
                    color="#fff"
                  />
                </View>
                <View style={styles.proceedTextContainer}>
                  <Text style={styles.proceedTitle}>Proceed to Fuel Pump</Text>
                  <Text style={styles.proceedSubtitle}>
                    Dispense fuel for this vehicle
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </TouchableOpacity>
            ) : (
              <View style={styles.noQuotaContainer}>
                <View style={styles.noQuotaIcon}>
                  <Ionicons name="alert-circle" size={48} color="#e94560" />
                </View>
                <Text style={styles.noQuotaTitle}>No Quota Available</Text>
                <Text style={styles.noQuotaText}>
                  This vehicle has exhausted its fuel quota for the current
                  period. Please check back after the quota reset date.
                </Text>
              </View>
            )}
          </Card>

          {/* Additional Info */}
          <View style={styles.additionalInfo}>
            <View style={styles.infoRow}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color="#7a8c9e"
              />
              <Text style={styles.additionalInfoText}>
                Quota resets every week on Monday
              </Text>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </Animated.View>
      </ScrollView>
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
    padding: 24,
    marginBottom: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  vehicleHeader: {
    flexDirection: "row",
    marginBottom: 24,
  },
  vehicleIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#e94560",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  vehicleHeaderInfo: {
    flex: 1,
    justifyContent: "center",
  },
  vehicleNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
  },
  // Info Grid
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  infoItem: {
    width: (width - 88) / 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    padding: 12,
    margin: 6,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#7a8c9e",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  // Quota Card
  quotaCard: {
    backgroundColor: "#253241",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  quotaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  quotaTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  quotaStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  quotaStatusText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  // Circular Progress
  circularProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  circularProgress: {
    marginRight: 24,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  progressPercentage: {
    fontSize: 36,
    fontWeight: "bold",
  },
  progressLabel: {
    fontSize: 14,
    color: "#7a8c9e",
    marginTop: 4,
  },
  quotaDetails: {
    flex: 1,
  },
  quotaDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  quotaDetailLabel: {
    fontSize: 14,
    color: "#7a8c9e",
  },
  quotaDetailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  noQuotaMessage: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
  },
  // Progress Bar
  progressBarContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  // Action Card
  actionCard: {
    backgroundColor: "#253241",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  proceedButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#00d25b",
  },
  proceedIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  proceedTextContainer: {
    flex: 1,
  },
  proceedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  proceedSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  // No Quota
  noQuotaContainer: {
    padding: 24,
    alignItems: "center",
  },
  noQuotaIcon: {
    marginBottom: 16,
  },
  noQuotaTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e94560",
    marginBottom: 12,
  },
  noQuotaText: {
    fontSize: 14,
    color: "#7a8c9e",
    textAlign: "center",
    lineHeight: 20,
  },
  // Additional Info
  additionalInfo: {
    marginTop: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  additionalInfoText: {
    fontSize: 12,
    color: "#7a8c9e",
    marginLeft: 6,
  },
});