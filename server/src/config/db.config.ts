import mongoose from "mongoose";
export const connectToDatabase = async (MONGODB_URI:string) => {
  try {
    const connectionInstance = await mongoose.connect(MONGODB_URI);
    return connectionInstance;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(errorMessage);
  }
};
