import React, { createContext, useContext, useState, useEffect } from "react";
import { subscribeToAuth, login as authLogin, logout as authLogout } from "../services/authService";
import { hasPermission as checkPermission } from "../utils/permissions";
import { getCurrentUserDoc } from "../services/authService";
import { auth } from "../services/firebase";
import { SEED_USERS } from "../data/seedData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((authUser, authProfile) => {
      setUser(authUser);
      setProfile(authProfile);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await authLogin(email, password);
      const currentUser = auth.currentUser;
      let profileData = null;
      if (currentUser) {
        try {
          profileData = await getCurrentUserDoc(currentUser.uid);
        } catch (_) {
          // ignore Firestore fetch errors
        }
      }
      if (!profileData) {
        const seed = SEED_USERS.find(u => u.email === email);
        if (seed) {
          profileData = {
            uid: currentUser?.uid,
            email: seed.email,
            fullName: seed.fullName,
            role: seed.role,
            department: seed.department || "Operaciones",
            areaId: seed.areaId || "",
            plantId: seed.plantId || "",
            status: "active"
          };
        } else {
          profileData = {
            uid: currentUser?.uid,
            email,
            role: email === "admin@styropek.com" ? "admin" : "user"
          };
        }
      }
      setUser(currentUser);
      setProfile(profileData);
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authLogout();
      setUser(null);
      setProfile(null);
    } catch (err) {
      setError(err.message || "Error al cerrar sesión");
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = permission => {
    if (!profile || !profile.role) return false;
    return checkPermission(profile.role, permission);
  };

  const value = {
    user,
    profile,
    loading,
    error,
    login,
    logout,
    hasPermission,
    role: profile?.role || null,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default useAuth;
