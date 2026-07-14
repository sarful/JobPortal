import axiosInstance from "./axiosInstance";

export const getCategories = async (params = {}) => {
  const response = await axiosInstance.get("/categories", {
    params,
  });

  return response.data;
};

export const getCategoryById = async (categoryId) => {
  const response = await axiosInstance.get(
    `/categories/${categoryId}`
  );

  return response.data;
};

export const createCategory = async (payload) => {
  const response = await axiosInstance.post(
    "/categories",
    payload
  );

  return response.data;
};

export const updateCategory = async (
  categoryId,
  payload
) => {
  const response = await axiosInstance.put(
    `/categories/${categoryId}`,
    payload
  );

  return response.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await axiosInstance.delete(
    `/categories/${categoryId}`
  );

  return response.data;
};