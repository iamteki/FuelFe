// src/screens/main/HomeScreen.js
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
  RefreshControl,
  Platform,
} from "react-native";
import { Card } from "react-native-paper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/api";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [refreshing, setRefreshing] = React.useState(false);
  const [stats, setStats] = React.useState({
    totalTransactions: 0,
    todayTransactions: 0,
    totalLitersPumped: 0,
    totalRevenue: 0,
  });

  const loadStats = async () => {
    try {
      const response = await apiService.getOperatorStats();
      if (response && response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  useEffect(() => {
    // Run animations
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
    ]).start();

    // Load initial stats
    loadStats();
  }, []);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Load fresh stats from API
    loadStats()
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  }, []);

  // Update the quickActions array in HomeScreen.js
  const quickActions = [
    {
      title: "Scan QR Code",
      subtitle: "Check vehicle fuel quota",
      icon: "qrcode-scan",
      color: "#e94560",
      bgColor: "rgba(233, 69, 96, 0.1)",
      onPress: () => navigation.navigate("ScanTab"),
    },
    {
      title: "Recent Activity",
      subtitle: "View transaction history",
      icon: "history",
      color: "#00a8ff",
      bgColor: "rgba(0, 168, 255, 0.1)",
      onPress: () => {}, // TODO: Implement
    },
    {
      title: "Fuel Inventory",
      subtitle: "Check available stock",
      icon: "fuel",
      color: "#00d25b",
      bgColor: "rgba(0, 210, 91, 0.1)",
      onPress: () => {}, // TODO: Implement
    },
    {
      title: "Reports",
      subtitle: "Daily & monthly reports",
      icon: "file-document-outline",
      color: "#ffab00",
      bgColor: "rgba(255, 171, 0, 0.1)",
      onPress: () => {}, // TODO: Implement
    },
  ];

  // Convert API stats to display format
  const displayStats = [
    {
      value: String(stats.todayTransactions || 0),
      label: "Transactions Today",
      icon: "car",
      color: "#e94560",
      trend: "",
      trendUp: true,
    },
    {
      value: `${(stats.totalLitersPumped || 0).toLocaleString()}L`,
      label: "Fuel Dispensed",
      icon: "gas-station",
      color: "#00a8ff",
      trend: "",
      trendUp: true,
    },
    {
      value: `Rs.${(stats.totalRevenue || 0).toLocaleString()}`,
      label: "Total Revenue",
      icon: "cash",
      color: "#00d25b",
      trend: "",
      trendUp: true,
    },
    {
      value: "94%",
      label: "Quota Used",
      icon: "chart-pie",
      color: "#ffab00",
      trend: "+5%",
      trendUp: true,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a2332" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || "Operator"}</Text>
            <Text style={styles.stationName}>
              {user?.stationName || "Fuel Station"}
            </Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#e94560" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#e94560"
            colors={["#e94560"]}
          />
        }
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Station Info Card */}
          <Card style={styles.stationCard}>
            <View style={styles.stationCardContent}>
              <View style={styles.stationIcon}>
                <MaterialCommunityIcons
                  name="gas-station"
                  size={24}
                  color="#fff"
                />
              </View>
              <View style={styles.stationInfo}>
                <Text style={styles.stationId}>
                  Station ID: {user?.stationId || "LK-001"}
                </Text>
                <Text style={styles.stationLocation}>Colombo District</Text>
              </View>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
          </Card>{" "}
          {/* Stats Grid */}
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            {displayStats.map((stat, index) => (
              <TouchableOpacity
                key={index}
                style={styles.statCard}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: stat.color + "20" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={stat.icon}
                    size={24}
                    color={stat.color}
                  />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                {stat.trend && (
                  <View style={styles.trendContainer}>
                    <Ionicons
                      name={stat.trendUp ? "trending-up" : "trending-down"}
                      size={16}
                      color={stat.trendUp ? "#00d25b" : "#e94560"}
                    />
                    <Text
                      style={[
                        styles.trendText,
                        { color: stat.trendUp ? "#00d25b" : "#e94560" },
                      ]}
                    >
                      {stat.trend}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: action.bgColor },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={action.icon}
                    size={28}
                    color={action.color}
                  />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Alert Card */}
          <Card style={styles.alertCard}>
            <View style={styles.alertContent}>
              <View style={styles.alertIcon}>
                <Ionicons name="information-circle" size={24} color="#ffab00" />
              </View>
              <View style={styles.alertTextContainer}>
                <Text style={styles.alertTitle}>System Notice</Text>
                <Text style={styles.alertMessage}>
                  Fuel quota system updated. Please ensure all QR scans are
                  synced.
                </Text>
              </View>
            </View>
          </Card>
          {/* Bottom Spacing */}
          <View style={{ height: 95 }} />
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
    backgroundColor: "#1e2939",
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
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
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: "#7a8c9e",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 2,
  },
  stationName: {
    fontSize: 14,
    color: "#7a8c9e",
    marginTop: 2,
  },
  logoutButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(233, 69, 96, 0.1)",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  stationCard: {
    backgroundColor: "#253241",
    borderRadius: 16,
    marginBottom: 24,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  stationCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  stationIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#e94560",
    justifyContent: "center",
    alignItems: "center",
  },
  stationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  stationId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  stationLocation: {
    fontSize: 14,
    color: "#7a8c9e",
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 210, 91, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00d25b",
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#00d25b",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: "#253241",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#7a8c9e",
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionCard: {
    width: (width - 48) / 2,
    backgroundColor: "#253241",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#7a8c9e",
    textAlign: "center",
  },
  alertCard: {
    backgroundColor: "#253241",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 171, 0, 0.2)",
  },
  alertContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255, 171, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: "#7a8c9e",
    lineHeight: 20,
  },
});
