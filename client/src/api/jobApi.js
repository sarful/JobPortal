import axiosInstance from "./axiosInstance";

export const getAllJobs = async (params = {}) => {
  const response = await axiosInstance.get("/jobs", {
    params,
  });

  return response.data;
};

export const getLatestJobs = async (limit = 6) => {
  const response = await axiosInstance.get("/jobs/latest", {
    params: {
      limit,
    },
  });

  return response.data;
};

export const getJobById = async (jobId) => {
  const response = await axiosInstance.get(`/jobs/${jobId}`);
  return response.data;
};

export const getMyJobs = async (params = {}) => {
  const response = await axiosInstance.get("/jobs/my-jobs", {
    params,
  });

  return response.data;
};

export const createJob = async (payload) => {
  const response = await axiosInstance.post("/jobs", payload);
  return response.data;
};

export const updateJob = async (jobId, payload) => {
  const response = await axiosInstance.put(
    `/jobs/${jobId}`,
    payload
  );

  return response.data;
};

export const updateJobStatus = async (jobId, status) => {
  const response = await axiosInstance.patch(
    `/jobs/${jobId}/status`,
    {
      status,
    }
  );

  return response.data;
};

export const deleteJob = async (jobId) => {
  const response = await axiosInstance.delete(`/jobs/${jobId}`);
  return response.data;
};