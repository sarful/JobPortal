import { create } from "zustand";
import {
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
} from "../api/authApi";
import { getErrorMessage } from "../utils/getErrorMessage";
import {
    getStoredToken,
    getStoredUser,
    removeAuthStorage,
    saveAuthStorage,
} from "../utils/storage";

const storedToken = getStoredToken();
const storedUser = getStoredUser();

export const useAuthStore = create((set, get) => ({
  user: storedUser,
  token: storedToken,
  isAuthenticated: Boolean(storedToken && storedUser),
  loading: false,
  initialized: false,
  error: null,

  setAuth: ({ user, token }) => {
    saveAuthStorage({
      user,
      token,
    });

    set({
      user,
      token,
      isAuthenticated: true,
      error: null,
    });
  },

  setUser: (user) => {
    const token = get().token;

    if (token) {
      saveAuthStorage({
        user,
        token,
      });
    }

    set({
      user,
    });
  },

  clearError: () => {
    set({
      error: null,
    });
  },

  login: async (credentials) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await loginUser(credentials);

      const user = response?.data?.user;
      const token = response?.data?.token;

      if (!user || !token) {
        throw new Error("Invalid login response.");
      }

      get().setAuth({
        user,
        token,
      });

      return response;
    } catch (error) {
      const message = getErrorMessage(error);

      set({
        error: message,
      });

      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },

  register: async (payload) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await registerUser(payload);

      const user = response?.data?.user;
      const token = response?.data?.token;

      if (!user || !token) {
        throw new Error("Invalid registration response.");
      }

      get().setAuth({
        user,
        token,
      });

      return response;
    } catch (error) {
      const message = getErrorMessage(error);

      set({
        error: message,
      });

      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },

  initializeAuth: async () => {
    const token = get().token;

    if (!token) {
      set({
        initialized: true,
        isAuthenticated: false,
      });

      return;
    }

    try {
      set({
        loading: true,
      });

      const response = await getCurrentUser();
      const user = response?.data?.user;

      if (!user) {
        throw new Error("Authenticated user was not found.");
      }

      get().setAuth({
        user,
        token,
      });
    } catch {
      removeAuthStorage();

      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    } finally {
      set({
        loading: false,
        initialized: true,
      });
    }
  },

  logout: async () => {
    try {
      if (get().token) {
        await logoutUser();
      }
    } catch {
      // Local logout must continue even if API logout fails.
    } finally {
      removeAuthStorage();

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  },
}));