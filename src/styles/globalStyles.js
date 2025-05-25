// src/styles/globalStyles.js
import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    elevation: 2,
    margin: 8,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  textCenter: {
    textAlign: "center",
  },
  mt8: { marginTop: 8 },
  mt16: { marginTop: 16 },
  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
  p8: { padding: 8 },
  p16: { padding: 16 },
});
