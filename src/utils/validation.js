// src/utils/validation.js
export const validateFuelAmount = (amount, maxQuota) => {
  if (!amount || isNaN(amount)) {
    return { isValid: false, error: "Please enter a valid amount" };
  }

  if (amount <= 0) {
    return { isValid: false, error: "Amount must be greater than 0" };
  }

  if (amount > maxQuota) {
    return {
      isValid: false,
      error: `Amount exceeds available quota (${maxQuota}L)`,
    };
  }

  return { isValid: true, error: null };
};

export const validateQRCode = (qrData) => {
  if (!qrData || typeof qrData !== "string") {
    return { isValid: false, error: "Invalid QR code format" };
  }

  if (qrData.length < 6) {
    return { isValid: false, error: "QR code too short" };
  }

  return { isValid: true, error: null };
};

export const validateLoginCredentials = (username, password) => {
  const errors = {};

  if (!username || username.trim().length === 0) {
    errors.username = "Username is required";
  }

  if (!password || password.length === 0) {
    errors.password = "Password is required";
  }

  if (password && password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
