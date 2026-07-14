import { useAuthStore } from "../store/authStore";

export default function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const loading = useAuthStore((state) => state.loading);
  const initialized = useAuthStore(
    (state) => state.initialized
  );
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const login = useAuthStore((state) => state.login);
  const register = useAuthStore(
    (state) => state.register
  );
  const logout = useAuthStore((state) => state.logout);
  const setUser = useAuthStore((state) => state.setUser);
  const initializeAuth = useAuthStore(
    (state) => state.initializeAuth
  );

  return {
    user,
    token,
    loading,
    initialized,
    isAuthenticated,
    login,
    register,
    logout,
    setUser,
    initializeAuth,

    isCandidate: user?.role === "candidate",
    isEmployer: user?.role === "employer",
    isAdmin: user?.role === "admin",
  };
}