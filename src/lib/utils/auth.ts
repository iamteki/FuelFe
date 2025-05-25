export const clearAuthData = () => {
  // Clear all auth-related data
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  
  // Clear any cookies if used
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  
  // Clear session storage
  sessionStorage.clear()
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token')
}

export const isAuthenticated = (): boolean => {
  const token = getAuthToken()
  const user = localStorage.getItem('user')
  return !!(token && user)
}