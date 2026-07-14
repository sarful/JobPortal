import axiosInstance from "./axiosInstance";

export const submitContactMessage = async (payload) => {
  const response = await axiosInstance.post(
    "/contact",
    payload
  );

  return response.data;
};

export const getContactMessages = async (params = {}) => {
  const response = await axiosInstance.get("/contact", {
    params,
  });

  return response.data;
};

export const getContactMessageById = async (messageId) => {
  const response = await axiosInstance.get(
    `/contact/${messageId}`
  );

  return response.data;
};

export const updateContactMessageStatus = async (
  messageId,
  status
) => {
  const response = await axiosInstance.patch(
    `/contact/${messageId}/status`,
    {
      status,
    }
  );

  return response.data;
};

export const deleteContactMessage = async (messageId) => {
  const response = await axiosInstance.delete(
    `/contact/${messageId}`
  );

  return response.data;
};