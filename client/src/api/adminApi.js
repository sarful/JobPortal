import axiosInstance from "./axiosInstance";

export const getAdminStatistics = async () => {
  const response = await axiosInstance.get(
    "/admin/statistics"
  );

  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const response = await axiosInstance.get(
    "/admin/users",
    {
      params,
    }
  );

  return response.data;
};

export const updateUserStatus = async (
  userId,
  isBlocked
) => {
  const response = await axiosInstance.patch(
    `/admin/users/${userId}/status`,
    {
      isBlocked,
    }
  );

  return response.data;
};

export const deleteAdminUser = async (userId) => {
  const response = await axiosInstance.delete(
    `/admin/users/${userId}`
  );

  return response.data;
};

export const getAdminJobs = async (params = {}) => {
  const response = await axiosInstance.get(
    "/admin/jobs",
    {
      params,
    }
  );

  return response.data;
};

export const getAdminApplications = async (
  params = {}
) => {
  const response = await axiosInstance.get(
    "/admin/applications",
    {
      params,
    }
  );

  return response.data;
};