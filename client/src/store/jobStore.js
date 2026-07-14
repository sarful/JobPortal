import { create } from "zustand";
import {
    createJob,
    deleteJob,
    getAllJobs,
    getJobById,
    getLatestJobs,
    getMyJobs,
    updateJob,
    updateJobStatus,
} from "../api/jobApi";
import { getErrorMessage } from "../utils/getErrorMessage";

const defaultPagination = {
  page: 1,
  limit: 10,
  totalJobs: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const useJobStore = create((set, get) => ({
  jobs: [],
  latestJobs: [],
  myJobs: [],
  selectedJob: null,
  relatedJobs: [],
  pagination: defaultPagination,

  hasApplied: false,
  isOwner: false,
  isExpired: false,

  loading: false,
  error: null,

  clearError: () => {
    set({
      error: null,
    });
  },

  clearSelectedJob: () => {
    set({
      selectedJob: null,
      relatedJobs: [],
      hasApplied: false,
      isOwner: false,
      isExpired: false,
    });
  },

  fetchJobs: async (params = {}) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await getAllJobs(params);
      const data = response?.data || {};

      set({
        jobs: data.jobs || [],
        pagination: data.pagination || defaultPagination,
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

  fetchLatestJobs: async (limit = 6) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await getLatestJobs(limit);

      set({
        latestJobs: response?.data?.jobs || [],
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

  fetchJobById: async (jobId) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await getJobById(jobId);
      const data = response?.data || {};

      set({
        selectedJob: data.job || null,
        relatedJobs: data.relatedJobs || [],
        hasApplied: Boolean(data.hasApplied),
        isOwner: Boolean(data.isOwner),
        isExpired: Boolean(data.isExpired),
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

  fetchMyJobs: async (params = {}) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await getMyJobs(params);
      const data = response?.data || {};

      set({
        myJobs: data.jobs || [],
        pagination: data.pagination || defaultPagination,
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

  addJob: async (payload) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await createJob(payload);
      const job = response?.data?.job;

      if (job) {
        set((state) => ({
          myJobs: [job, ...state.myJobs],
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

  editJob: async (jobId, payload) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await updateJob(jobId, payload);
      const updatedJob = response?.data?.job;

      if (updatedJob) {
        set((state) => ({
          selectedJob: updatedJob,
          myJobs: state.myJobs.map((job) =>
            (job._id || job.id) === jobId
              ? updatedJob
              : job
          ),
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

  changeJobStatus: async (jobId, status) => {
    try {
      const response = await updateJobStatus(jobId, status);
      const updatedJob = response?.data?.job;

      set((state) => ({
        myJobs: state.myJobs.map((job) =>
          (job._id || job.id) === jobId
            ? updatedJob || { ...job, status }
            : job
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

  removeJob: async (jobId) => {
    try {
      const response = await deleteJob(jobId);

      set((state) => ({
        myJobs: state.myJobs.filter(
          (job) => (job._id || job.id) !== jobId
        ),
        jobs: state.jobs.filter(
          (job) => (job._id || job.id) !== jobId
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

  markAsApplied: () => {
    set({
      hasApplied: true,
    });
  },
}));