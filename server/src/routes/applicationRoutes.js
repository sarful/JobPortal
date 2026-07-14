import express from "express";
import {
    applyForJob,
    getApplicationById,
    getJobApplications,
    getMyApplications,
    updateApplicationStatus,
    withdrawApplication,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/jobs/:jobId/apply",
  protect,
  authorize("candidate"),
  applyForJob
);

router.get(
  "/applications/my-applications",
  protect,
  authorize("candidate"),
  getMyApplications
);

router.get(
  "/jobs/:jobId/applications",
  protect,
  authorize("employer", "admin"),
  getJobApplications
);

router.get(
  "/applications/:id",
  protect,
  getApplicationById
);

router.patch(
  "/applications/:id/status",
  protect,
  authorize("employer", "admin"),
  updateApplicationStatus
);

router.delete(
  "/applications/:id",
  protect,
  authorize("candidate"),
  withdrawApplication
);

export default router;