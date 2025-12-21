// lib/auth.ts
export interface UserPayload {
  userId: string;
  email: string;
  role: string;
  username: string;
}

export interface AuthState {
  token: string | null;
  user: UserPayload | null;
  isAuthenticated: boolean;
}

// Store auth data in localStorage
export const storeAuthData = (token: string, user: UserPayload) => {
  if (typeof window === 'undefined') return;
  
  const authData = {
    token,
    user,
    isAuthenticated: true,
  };
  
  localStorage.setItem('auth', JSON.stringify(authData));
};

// Get auth data from localStorage
export const getAuthData = (): AuthState => {
  if (typeof window === 'undefined') {
    return {
      token: null,
      user: null,
      isAuthenticated: false,
    };
  }
  
  const stored = localStorage.getItem('auth');
  if (!stored) {
    return {
      token: null,
      user: null,
      isAuthenticated: false,
    };
  }
  
  return JSON.parse(stored);
};

// Clear auth data
export const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth');
};

// Check if user has specific role
export const hasRole = (role: string): boolean => {
  const { user } = getAuthData();
  return user?.role === role;
};

// Check if user has any of the specified roles
export const hasAnyRole = (roles: string[]): boolean => {
  const { user } = getAuthData();
  return roles.includes(user?.role || '');
};

// Get user role
export const getUserRole = (): string | null => {
  const { user } = getAuthData();
  return user?.role || null;
};

// Get user info
export const getUserInfo = (): UserPayload | null => {
  const { user } = getAuthData();
  return user;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const { isAuthenticated } = getAuthData();
  return isAuthenticated || false;
};

// Generate token (if you don't have this already)
export async function generateToken(payload: UserPayload): Promise<string> {
  // Implement your JWT token generation here
  // For now, returning a mock token
  const response = await fetch('/api/auth/generate-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  const data = await response.json();
  return data.token;
}