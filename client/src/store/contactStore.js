import { create } from "zustand";
import {
    deleteContactMessage,
    getContactMessageById,
    getContactMessages,
    submitContactMessage,
    updateContactMessageStatus,
} from "../api/contactApi";
import { getErrorMessage } from "../utils/getErrorMessage";

const defaultPagination = {
  page: 1,
  limit: 10,
  totalMessages: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const useContactStore = create((set) => ({
  messages: [],
  selectedMessage: null,
  pagination: defaultPagination,

  loading: false,
  error: null,

  clearError: () => {
    set({
      error: null,
    });
  },

  submitMessage: async (payload) => {
    try {
      set({
        loading: true,
        error: null,
      });

      return await submitContactMessage(payload);
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

  fetchMessages: async (params = {}) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await getContactMessages(params);
      const data = response?.data || {};

      set({
        messages: data.messages || [],
        pagination:
          data.pagination || defaultPagination,
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

  fetchMessageById: async (messageId) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response =
        await getContactMessageById(messageId);

      const message =
        response?.data?.contactMessage || null;

      set((state) => ({
        selectedMessage: message,
        messages: state.messages.map((item) =>
          (item._id || item.id) === messageId
            ? message || item
            : item
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

  changeMessageStatus: async (messageId, status) => {
    try {
      const response =
        await updateContactMessageStatus(
          messageId,
          status
        );

      const updatedMessage =
        response?.data?.contactMessage;

      set((state) => ({
        messages: state.messages.map((message) =>
          (message._id || message.id) === messageId
            ? updatedMessage || {
                ...message,
                status,
              }
            : message
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

  removeMessage: async (messageId) => {
    try {
      const response = await deleteContactMessage(
        messageId
      );

      set((state) => ({
        messages: state.messages.filter(
          (message) =>
            (message._id || message.id) !== messageId
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