import { create } from "zustand";
import {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory,
} from "../api/categoryApi";
import { getErrorMessage } from "../utils/getErrorMessage";

export const useCategoryStore = create((set) => ({
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,

  clearError: () => {
    set({
      error: null,
    });
  },

  setSelectedCategory: (category) => {
    set({
      selectedCategory: category,
    });
  },

  fetchCategories: async (params = {}) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await getCategories(params);

      set({
        categories:
          response?.data?.categories ||
          response?.data ||
          [],
      });

      return response;
    } catch (error) {
      set({
        error: getErrorMessage(error),
      });

      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },

  addCategory: async (payload) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await createCategory(payload);
      const category = response?.data?.category;

      if (category) {
        set((state) => ({
          categories: [
            category,
            ...state.categories,
          ],
        }));
      }

      return response;
    } catch (error) {
      set({
        error: getErrorMessage(error),
      });

      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },

  editCategory: async (categoryId, payload) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await updateCategory(
        categoryId,
        payload
      );

      const updatedCategory =
        response?.data?.category;

      set((state) => ({
        selectedCategory: null,
        categories: state.categories.map((category) =>
          (category._id || category.id) === categoryId
            ? updatedCategory || {
                ...category,
                ...payload,
              }
            : category
        ),
      }));

      return response;
    } catch (error) {
      set({
        error: getErrorMessage(error),
      });

      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },

  removeCategory: async (categoryId) => {
    try {
      const response = await deleteCategory(categoryId);

      set((state) => ({
        categories: state.categories.filter(
          (category) =>
            (category._id || category.id) !==
            categoryId
        ),
      }));

      return response;
    } catch (error) {
      set({
        error: getErrorMessage(error),
      });

      throw error;
    }
  },
}));