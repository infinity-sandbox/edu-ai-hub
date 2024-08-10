// src/utils/auth.ts
export const isAuthenticated = (): boolean => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    // Check if both access and refresh tokens are present
    return !!accessToken && !!refreshToken;
  };