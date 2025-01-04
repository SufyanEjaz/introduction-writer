// Helper functions for authentication
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // Returns true if a token exists
};


export const logout = () => {
  localStorage.removeItem('token');
};
