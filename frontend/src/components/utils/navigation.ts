// src/utils/navigation.ts
import { useNavigate } from 'react-router-dom';

export const useProtectedNavigation = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  const navigateTo = (path: string) => {
    if (accessToken && refreshToken) {
      navigate(`${path}?access-token=${accessToken}&refresh-token=${refreshToken}`);
    } else {
      navigate('/login');
    }
  };

  return { navigateTo };
};