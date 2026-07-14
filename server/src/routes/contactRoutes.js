import express from "express";
import {
    createContactMessage,
    deleteContactMessage,
    getContactMessageById,
    getContactMessages,
    updateContactMessageStatus,
} from "../controllers/contactController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", createContactMessage);

router.get(
  "/",
  protect,
  authorize("admin"),
  getContactMessages
);

router.get(
  "/:id",
  protect,
  authorize("admin"),
  getContactMessageById
);

router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  updateContactMessageStatus
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteContactMessage
);

export default router;