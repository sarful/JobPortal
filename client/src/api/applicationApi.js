import axiosInstance from "./axiosInstance";

export const applyForJob = async (jobId, payload) => {
  const response = await axiosInstance.post(
    `/jobs/${jobId}/apply`,
    payload
  );

  return response.data;
};

export const getMyApplications = async (params = {}) => {
  const response = await axiosInstance.get(
    "/applications/my-applications",
    {
      params,
    }
  );

  return response.data;
};

export const getJobApplications = async (
  jobId,
  params = {}
) => {
  const response = await axiosInstance.get(
    `/jobs/${jobId}/applications`,
    {
      params,
    }
  );

  return response.data;
};

export const getApplicationById = async (applicationId) => {
  const response = await axiosInstance.get(
    `/applications/${applicationId}`
  );

  return response.data;
};

export const updateApplicationStatus = async (
  applicationId,
  payload
) => {
  const response = await axiosInstance.patch(
    `/applications/${applicationId}/status`,
    payload
  );

  return response.data;
};

export const withdrawApplication = async (applicationId) => {
  const response = await axiosInstance.delete(
    `/applications/${applicationId}`
  );

  return response.data;
};