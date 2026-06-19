"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

const API = process.env.NEXT_PUBLIC_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true on first mount — prevents flash

  // ── On mount: restore session from localStorage ──────────────────────────
  // This is what prevents redirect to Login on page reload
  useEffect(() => {
    const storedToken = localStorage.getItem("dll_token");
    if (!storedToken) {
      setLoading(false);
      return;
    }
    // verify token is still valid by calling /auth/me
    axios
      .get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => {
        setUser(res.data.user);
        setToken(storedToken);
      })
      .catch(() => {
        // token expired or invalid — clear it
        localStorage.removeItem("dll_token");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ── Save token helper ─────────────────────────────────────────────────────
  const saveSession = (userData, userToken) => {
    localStorage.setItem("dll_token", userToken);
    setUser(userData);
    setToken(userToken);
  };

  // ── Register ──────────────────────────────────────────────────────────────
  const register = async ({ name, email, password, photoURL }) => {
    const res = await axios.post(`${API}/auth/register`, {
      name,
      email,
      password,
      photoURL,
    });
    saveSession(res.data.user, res.data.token);
    return res.data;
  };

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = async ({ email, password }) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    saveSession(res.data.user, res.data.token);
    return res.data;
  };

  // ── Google login ──────────────────────────────────────────────────────────
  // Call this after Google gives you the profile info
  const googleLogin = async ({ name, email, photoURL }) => {
    const res = await axios.post(`${API}/auth/google`, {
      name,
      email,
      photoURL,
    });
    saveSession(res.data.user, res.data.token);
    return res.data;
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("dll_token");
    setUser(null);
    setToken(null);
    toast.success("Logged out successfully");
  };

  // ── Update user locally (after profile update) ────────────────────────────
  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  // ── Axios auth header helper ───────────────────────────────────────────────
  const authHeader = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  const value = {
    user,
    token,
    loading,
    register,
    login,
    googleLogin,
    logout,
    updateUser,
    authHeader,
    isAdmin: user?.role === "admin",
    isPremium: user?.isPremium === true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// custom hook
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
