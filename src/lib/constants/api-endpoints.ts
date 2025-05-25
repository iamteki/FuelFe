export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    CHECK_USERNAME: '/auth/check-username',
    CHECK_EMAIL: '/auth/check-email',
  },

  // Vehicle Owner endpoints
  VEHICLE_OWNER: {
    PROFILE: '/vehicle-owner/profile',
    UPDATE_PROFILE: '/vehicle-owner/profile',
    DASHBOARD_STATS: '/vehicle-owner/dashboard/stats',
    VEHICLES: {
      LIST: '/vehicle-owner/vehicles',
      REGISTER: '/vehicle-owner/vehicles/register',
      BY_ID: (id: number) => `/vehicle-owner/vehicles/${id}`,
      BY_NUMBER: (number: string) => `/vehicle-owner/vehicles/by-number/${number}`,
      UPDATE: (id: number) => `/vehicle-owner/vehicles/${id}`,
      DELETE: (id: number) => `/vehicle-owner/vehicles/${id}`,
    },
  },

  // Fuel Station endpoints
  FUEL_STATION: {
    REGISTER: '/fuel-station/register',
    MY_STATION: '/fuel-station/my-station',
    BY_ID: (id: number) => `/fuel-station/${id}`,
    LIST: '/fuel-station',
    UPDATE: (id: number) => `/fuel-station/${id}`,
    DEACTIVATE: (id: number) => `/fuel-station/${id}`,
    OPERATORS: {
      REGISTER: '/fuel-station/operators/register',
      LIST: '/fuel-station/operators',
      BY_ID: (id: number) => `/fuel-station/operators/${id}`,
      UPDATE: (id: number) => `/fuel-station/operators/${id}`,
      ACTIVATE: (id: number) => `/fuel-station/operators/${id}/activate`,
      DEACTIVATE: (id: number) => `/fuel-station/operators/${id}/deactivate`,
    },
  },

  // Transaction endpoints
  TRANSACTIONS: {
    SCAN_QR: '/transactions/scan-qr',
    PUMP_FUEL: '/transactions/pump-fuel',
    BY_ID: (id: number) => `/transactions/${id}`,
    BY_VEHICLE: (vehicleId: number) => `/transactions/vehicle/${vehicleId}`,
    BY_FUEL_STATION: (stationId: number) => `/transactions/fuel-station/${stationId}`,
    MY_TRANSACTIONS: '/transactions/my-transactions',
  },

  // QR Code endpoints
  QR: {
    GENERATE: (vehicleId: number) => `/qr/generate/${vehicleId}`,
    SCAN: '/qr/scan',
  },

  // Admin endpoints
  ADMIN: {
    DASHBOARD_STATS: '/admin/dashboard/stats',
    FUEL_STATIONS: {
      PENDING: '/admin/fuel-stations/pending',
      APPROVE: (id: number) => `/admin/fuel-stations/${id}/approve`,
      REJECT: (id: number) => `/admin/fuel-stations/${id}/reject`,
    },
    USERS: {
      LIST: '/admin/users',
      ACTIVATE: (id: number) => `/admin/users/${id}/activate`,
      DEACTIVATE: (id: number) => `/admin/users/${id}/deactivate`,
    },
    REPORTS: {
      TRANSACTIONS: '/admin/reports/transactions',
      FUEL_CONSUMPTION: '/admin/reports/fuel-consumption',
    },
  },

  // Mobile API endpoints (for reference)
  MOBILE: {
    LOGIN: '/mobile/api/auth/login',
    SCAN_QR: '/mobile/api/scan-qr',
    VEHICLE_QUOTA: (vehicleId: number) => `/mobile/api/vehicle/${vehicleId}/quota`,
    PUMP_FUEL: '/mobile/api/pump-fuel',
    OPERATOR_PROFILE: '/mobile/api/operator/profile',
    OPERATOR_TRANSACTIONS: '/mobile/api/operator/transactions/today',
    OPERATOR_STATS: '/mobile/api/operator/stats',
    HEALTH: '/mobile/api/health',
  },

  // Health check
  HEALTH: '/health',
}