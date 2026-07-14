import mongoose from "mongoose";

/**
 * Connect the application to MongoDB.
 */
const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is missing from the environment variables.");
    }

    const connection = await mongoose.connect(mongoUri);

    console.log(
      `MongoDB connected successfully: ${connection.connection.host}`
    );
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDatabase;