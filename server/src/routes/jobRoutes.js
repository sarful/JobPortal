import express from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getLatestJobs,
  getMyJobs,
  updateJob,
  updateJobStatus,
} from "../controllers/jobController.js";
import {
  optionalProtect,
  protect,
} from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/latest", getLatestJobs);
router.get("/", getAllJobs);

router.get(
  "/my-jobs",
  protect,
  authorize("employer", "admin"),
  getMyJobs
);

router.post(
  "/",
  protect,
  authorize("employer", "admin"),
  createJob
);

router.get("/:id", optionalProtect, getJobById);

router.put(
  "/:id",
  protect,
  authorize("employer", "admin"),
  updateJob
);

router.patch(
  "/:id/status",
  protect,
  authorize("employer", "admin"),
  updateJobStatus
);

router.delete(
  "/:id",
  protect,
  authorize("employer", "admin"),
  deleteJob
);

export default router;