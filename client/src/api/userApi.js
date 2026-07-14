import axiosInstance from "./axiosInstance";

export const getProfile = async () => {
  const response = await axiosInstance.get("/users/profile");
  return response.data;
};

export const updateProfile = async (payload) => {
  const response = await axiosInstance.put("/users/profile", payload);
  return response.data;
};

export const updatePassword = async (payload) => {
  const response = await axiosInstance.put("/users/password", payload);
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};

export const deleteOwnAccount = async (password) => {
  const response = await axiosInstance.delete("/users/profile", {
    data: {
      password,
    },
  });

  return response.data;
};