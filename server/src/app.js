import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import applicationRoutes from "./routes/applicationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import {
    errorHandler,
    notFound,
} from "./middleware/errorMiddleware.js";

const app = express();

/**
 * Security headers
 */
app.use(helmet());

/**
 * CORS configuration
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * Request body parsers
 */
app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

app.use(cookieParser());

/**
 * Global API rate limiter
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many requests from this IP address. Please try again later.",
  },
});

app.use("/api", apiLimiter);

/**
 * Stricter authentication rate limiter
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again later.",
  },
});

/**
 * Health check
 */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Job Portal API is running.",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

/**
 * API routes
 */
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);

/*
 * applicationRoutes already contains:
 * /jobs/:jobId/apply
 * /jobs/:jobId/applications
 * /applications/...
 *
 * Therefore, mount it directly under /api.
 */
app.use("/api", applicationRoutes);

app.use("/api/contact", contactRoutes);

/**
 * Unknown route handler
 */
app.use(notFound);

/**
 * Global error handler
 */
app.use(errorHandler);

export default app;