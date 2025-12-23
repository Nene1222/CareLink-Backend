import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import Cookies from 'js-cookie';

export interface User {
  _id: string;
  name: string;
  email: string;
  tokens?: { name: string; token: string }[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (user: User) => void;
  logout: () => void;
  setError: (error: string) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
    // Store user data in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    // Clear stored data
    localStorage.removeItem('user');
    Cookies.remove('token');
  };

  const setError = (error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check for existing authentication on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = Cookies.get('token');

    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        // If parsing fails, clear stored data
        localStorage.removeItem('user');
        Cookies.remove('token');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const value: AuthContextType = {
    state,
    dispatch,
    login,
    logout,
    setError,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
