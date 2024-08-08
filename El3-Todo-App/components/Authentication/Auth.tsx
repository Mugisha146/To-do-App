import React, { createContext, useState, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login, signup, logout } from "../../services/api";

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      setToken(response.data.token);
      await AsyncStorage.setItem("token", response.data.token);
    } catch (error) {
      console.error("Error logging in", error);
    }
  };

  const handleSignup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const response = await signup(email, password, firstName, lastName);
      setToken(response.data.token);
      await AsyncStorage.setItem("token", response.data.token);
    } catch (error) {
      console.error("Error signing up", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setToken(null);
      await AsyncStorage.removeItem("token");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
