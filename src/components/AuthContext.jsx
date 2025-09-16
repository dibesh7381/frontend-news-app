// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ correct import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken && typeof storedToken === "string") {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token:", err);
        logout();
      }
    } else {
      setUser(null);
      setToken(null);
    }
    setAuthLoading(false);
  }, []);

  const login = (jwtToken) => {
    if (!jwtToken || typeof jwtToken !== "string") {
      console.error("login failed: invalid token");
      return;
    }

    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);

    try {
      const decoded = jwtDecode(jwtToken);
      setUser(decoded); // ✅ user info directly from token
    } catch (err) {
      console.error("Invalid token:", err);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
