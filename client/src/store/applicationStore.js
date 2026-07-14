import { create } from "zustand";
import {
    applyForJob,
    getApplicationById,
    getJobApplications,
    getMyApplications,
    updateApplicationStatus,
    withdrawApplication,
} from "../api/applicationApi";
import { getErrorMessage } from "../utils/getErrorMessage";

const defaultPagination = {
  page: 1,
  limit: 10,
  totalApplications: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const useApplicationStore = create((set) => ({
  applications: [],
  jobApplications: [],
  selectedApplication: null,
  selectedJob: null,
  pagination: defaultPagination,

  loading: false,
  error: null,

  clearError: () => {
    set({
      error: null,
    });
  },

  clearSelectedApplication: () => {
    set({
      selectedApplication: null,
    });
  },

  submitApplication: async (jobId, payload) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await applyForJob(jobId, payload);
      const application = response?.data?.application;

      if (application) {
        set((state) => ({
          applications: [
            application,
            ...state.applications,
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

  fetchMyApplications: async (params = {}) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await getMyApplications(params);
      const data = response?.data || {};

      set({
        applications: data.applications || [],
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

  fetchJobApplications: async (jobId, params = {}) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await getJobApplications(
        jobId,
        params
      );

      const data = response?.data || {};

      set({
        selectedJob: data.job || null,
        jobApplications: data.applications || [],
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

  fetchApplicationById: async (applicationId) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response =
        await getApplicationById(applicationId);

      set({
        selectedApplication:
          response?.data?.application || null,
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

  changeApplicationStatus: async (
    applicationId,
    payload
  ) => {
    try {
      const response = await updateApplicationStatus(
        applicationId,
        payload
      );

      const updatedApplication =
        response?.data?.application;

      set((state) => ({
        selectedApplication:
          state.selectedApplication &&
          (state.selectedApplication._id ||
            state.selectedApplication.id) ===
            applicationId
            ? updatedApplication
            : state.selectedApplication,

        jobApplications: state.jobApplications.map(
          (application) =>
            (application._id || application.id) ===
            applicationId
              ? updatedApplication || {
                  ...application,
                  ...payload,
                }
              : application
        ),

        applications: state.applications.map(
          (application) =>
            (application._id || application.id) ===
            applicationId
              ? updatedApplication || {
                  ...application,
                  ...payload,
                }
              : application
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

  withdraw: async (applicationId) => {
    try {
      const response = await withdrawApplication(
        applicationId
      );

      set((state) => ({
        applications: state.applications.filter(
          (application) =>
            (application._id || application.id) !==
            applicationId
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