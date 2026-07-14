import "dotenv/config";
import app from "./app.js";
import connectDatabase from "./config/database.js";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    const server = app.listen(PORT, () => {
      console.log(
        `Server running in ${
          process.env.NODE_ENV || "development"
        } mode on port ${PORT}`
      );
    });

    const shutdown = (signal) => {
      console.log(`${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        try {
          const mongoose = await import("mongoose");
          await mongoose.default.connection.close();

          console.log("MongoDB connection closed.");
          process.exit(0);
        } catch (error) {
          console.error(
            `Error during shutdown: ${error.message}`
          );
          process.exit(1);
        }
      });

      setTimeout(() => {
        console.error(
          "Forced shutdown because active connections did not close."
        );
        process.exit(1);
      }, 10000).unref();
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

startServer();