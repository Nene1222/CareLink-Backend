// lib/utils/roleUtils.ts
export const getUserRole = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userRole');
};

export const hasRole = (requiredRole: string | string[]): boolean => {
  const userRole = getUserRole();
  if (!userRole) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  
  return userRole === requiredRole;
};

export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Quick role check helpers
export const isAdmin = () => hasRole('admin');
export const isDoctor = () => hasRole('doctor');
export const isPatient = () => hasRole('patient');
export const isReceptionist = () => hasRole('receptionist');
export const isNurse = () => hasRole('nurse');