"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (storedToken) {
      console.debug("AuthProvider: found stored token");
      setToken(storedToken);
      try {
        const payload = JSON.parse(
          atob(storedToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        if (payload && payload.userId) setUserId(payload.userId);
      } catch (e) {
        // ignore
      }
    }
    setLoading(false);
  }, []);

  const login = (jwt) => {
    console.debug("AuthProvider.login called");
    setToken(jwt);
    localStorage.setItem("token", jwt);
    try {
      const payload = JSON.parse(
        atob(jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      if (payload && payload.userId) {
        console.debug("AuthProvider.login set userId", payload.userId);
        setUserId(payload.userId);
        localStorage.setItem("userId", payload.userId);
      }
    } catch (e) {
      // ignore
    }
  };

  const logout = () => {
    console.debug("AuthProvider.logout");
    setToken(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
