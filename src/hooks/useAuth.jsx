import React, { createContext, useContext, useState, useEffect } from "react";
import { subscribeToAuth, login as authLogin, logout as authLogout } from "../services/authService";
import { hasPermission as checkPermission } from "../utils/permissions";
import { getCurrentUserDoc } from "../services/authService";
import { auth } from "../services/firebase";
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
    console.log('AUTH LOGIN START');
    setLoading(true);
    setError(null);
    try {
      await authLogin(email, password);
      // After login, obtain current user
      const currentUser = auth.currentUser;
      let profileData = null;
      if (currentUser) {
        try {
          profileData = await getCurrentUserDoc(currentUser.uid);
        } catch (profileErr) {
          console.error('Error fetching profile after login:', profileErr);
        }
      }
      if (!profileData) {
        const role = email === 'admin@styropek.com' ? 'admin' : 'user';
        profileData = { uid: currentUser?.uid, email, role };
        console.log('PROFILE FALLBACK USED');
      } else {
        console.log('PROFILE LOADED');
      }
      setUser(currentUser);
      setProfile(profileData);
      console.log('AUTH STATE CHANGED');
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
      console.error('Login error:', err);
      throw err;
    } finally {
      setLoading(false);
      console.log('AUTH LOADING FALSE');
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authLogout();
      setProfile(null);
      setUser(null);
    } catch (err) {
      setError(err.message || "Error al cerrar sesión");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Checks if the currently logged in user has a specific permission.
   * @param {string} permission 
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
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
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
export default useAuth;
