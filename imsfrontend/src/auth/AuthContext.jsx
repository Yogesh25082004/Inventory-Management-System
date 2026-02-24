import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
const USER_STORAGE_KEY = "user";
const TOKEN_STORAGE_KEY = "authToken";

export const getStoredAuthToken = () =>
  localStorage.getItem(TOKEN_STORAGE_KEY);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem(USER_STORAGE_KEY)));
  const [token, setToken] = useState(getStoredAuthToken());
  const role = (user?.role || "USER").toUpperCase();

  const login = (userData, authToken = null) => {
    setUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

    if (authToken) {
      setToken(authToken);
      localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ user, role, token, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
