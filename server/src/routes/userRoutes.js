import express from "express";
import {
    deleteOwnAccount,
    getProfile,
    getUserById,
    updatePassword,
    updateProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/profile")
  .get(protect, getProfile)
  .put(protect, updateProfile)
  .delete(protect, deleteOwnAccount);

router.put("/password", protect, updatePassword);

router.get("/:id", getUserById);

export default router;