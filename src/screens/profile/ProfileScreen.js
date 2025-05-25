// src/screens/profile/ProfileScreen.js
import React, { useEffect, useRef, useState } from "react";
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
} from "react-native";
import { Card } from "react-native-paper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/api";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [operatorProfile, setOperatorProfile] = useState(null);
  const [operatorStats, setOperatorStats] = useState(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  useEffect(() => {
    // Start animations
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

    // Load operator profile and stats
    const loadProfileData = async () => {
      try {
        // Load profile
        const profileResponse = await apiService.getOperatorProfile();
        if (profileResponse && profileResponse.success) {
          setOperatorProfile(profileResponse.data);
        }

        // Load stats
        const statsResponse = await apiService.getOperatorStats();
        if (statsResponse && statsResponse.success) {
          setOperatorStats(statsResponse.data);
        }
      } catch (error) {
        console.error("Failed to load profile data:", error);
      }
    };

    loadProfileData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: logout, style: "destructive" },
      ],
      { cancelable: true }
    );
  };

  const menuItems = [
    {
      title: "Account Settings",
      subtitle: "Manage your account details",
      icon: "person-outline",
      color: "#00a8ff",
      onPress: () => {},
    },
    {
      title: "Change Password",
      subtitle: "Update your security credentials",
      icon: "lock-closed-outline",
      color: "#e94560",
      onPress: () => {},
    },
    {
      title: "Notifications",
      subtitle: "Configure alert preferences",
      icon: "notifications-outline",
      color: "#ffab00",
      onPress: () => {},
    },
    {
      title: "Station Settings",
      subtitle: "Manage station preferences",
      icon: "business-outline",
      color: "#00d25b",
      onPress: () => {},
    },
    {
      title: "Help & Support",
      subtitle: "Get assistance and FAQs",
      icon: "help-circle-outline",
      color: "#8b80f9",
      onPress: () => {},
    },
    {
      title: "About",
      subtitle: "App version and information",
      icon: "information-circle-outline",
      color: "#00cfe8",
      onPress: () => {},
    },
  ];
  // Format stats from API data
  const formattedStats = [
    {
      label: "Total Transactions",
      value: operatorStats?.totalTransactions?.toLocaleString() || "0",
      icon: "car",
    },
    {
      label: "Today's Transactions",
      value: operatorStats?.todayTransactions?.toLocaleString() || "0",
      icon: "calendar",
    },
    {
      label: "Total Revenue",
      value: `Rs.${operatorStats?.totalRevenue?.toLocaleString() || "0"}`,
      icon: "cash",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a2332" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
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
          {/* Profile Card */}
          <Card style={styles.profileCard}>
            <View style={styles.profileContent}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user?.name?.charAt(0).toUpperCase() || "O"}
                  </Text>
                </View>
                <View style={styles.onlineDot} />
              </View>{" "}
              <Text style={styles.name}>
                {operatorProfile?.operatorName || user?.name || "Operator"}
              </Text>
              <Text style={styles.station}>
                {operatorProfile?.fuelStationName ||
                  user?.stationName ||
                  "Fuel Station"}
              </Text>
              <View style={styles.idBadge}>
                <MaterialCommunityIcons
                  name="gas-station"
                  size={16}
                  color="#e94560"
                />
                <Text style={styles.stationId}>
                  ID: {operatorProfile?.operatorId || user?.id || "LK-001"}
                </Text>
              </View>
              {/* Stats Row */}{" "}
              <View style={styles.statsRow}>
                {formattedStats.map((stat, index) => (
                  <View key={index} style={styles.statItem}>
                    <View style={styles.statIconContainer}>
                      <Ionicons name={stat.icon} size={20} color="#e94560" />
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: "rgba(0, 168, 255, 0.1)" },
                ]}
              >
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color="#00a8ff"
                />
              </View>
              <Text style={styles.quickActionText}>Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: "rgba(0, 210, 91, 0.1)" },
                ]}
              >
                <Ionicons
                  name="stats-chart-outline"
                  size={24}
                  color="#00d25b"
                />
              </View>
              <Text style={styles.quickActionText}>Analytics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: "rgba(255, 171, 0, 0.1)" },
                ]}
              >
                <Ionicons name="time-outline" size={24} color="#ffab00" />
              </View>
              <Text style={styles.quickActionText}>History</Text>
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Settings</Text>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.menuIconContainer,
                    { backgroundColor: item.color + "20" },
                  ]}
                >
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#7a8c9e" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Section */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <View style={styles.logoutIconContainer}>
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* App Version */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>FuelStation Pro v1.0.0</Text>
            <Text style={styles.copyrightText}>
              © 2024 Sri Lanka Fuel Management
            </Text>
          </View>

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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  // Profile Card
  profileCard: {
    backgroundColor: "#253241",
    borderRadius: 20,
    marginBottom: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  profileContent: {
    padding: 24,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e94560",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#e94560",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  onlineDot: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#00d25b",
    borderWidth: 3,
    borderColor: "#253241",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  station: {
    fontSize: 16,
    color: "#7a8c9e",
    marginBottom: 12,
  },
  idBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(233, 69, 96, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  stationId: {
    fontSize: 14,
    color: "#e94560",
    fontWeight: "600",
    marginLeft: 6,
  },
  // Stats Row
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  statItem: {
    alignItems: "center",
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(233, 69, 96, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#7a8c9e",
  },
  // Quick Actions
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: "#253241",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  // Menu Section
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#253241",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#7a8c9e",
  },
  // Logout Button
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e94560",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 5,
    shadowColor: "#e94560",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  logoutIconContainer: {
    marginRight: 12,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  // Version Info
  versionContainer: {
    alignItems: "center",
  },
  versionText: {
    fontSize: 14,
    color: "#7a8c9e",
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: "#7a8c9e",
  },
});
