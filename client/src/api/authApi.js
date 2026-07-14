import axiosInstance from "./axiosInstance";

/**
 * Register a candidate or employer.
 *
 * Expected payload:
 * {
 *   name,
 *   email,
 *   password,
 *   confirmPassword,
 *   role,
 *   phone?,
 *   companyName?
 * }
 */
export const registerUser = async (payload) => {
  const response = await axiosInstance.post("/auth/register", payload);
  return response.data;
};

/**
 * Log in with email and password.
 *
 * Expected payload:
 * {
 *   email,
 *   password
 * }
 */
export const loginUser = async (payload) => {
  const response = await axiosInstance.post("/auth/login", payload);
  return response.data;
};

/**
 * Get the currently authenticated user.
 */
export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

/**
 * Log out the authenticated user.
 */
export const logoutUser = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};