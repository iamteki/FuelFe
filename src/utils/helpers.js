// src/utils/helpers.js
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatFuelAmount = (amount) => {
  return `${parseFloat(amount).toFixed(1)}L`;
};

export const calculateQuotaPercentage = (current, max) => {
  if (max === 0) return 0;
  return Math.round((current / max) * 100);
};

export const getQuotaStatusColor = (percentage) => {
  if (percentage > 50) return "#4CAF50"; // Green
  if (percentage > 20) return "#FF9800"; // Orange
  return "#F44336"; // Red
};

export const generateTransactionId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `TXN${timestamp}${random}`;
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
