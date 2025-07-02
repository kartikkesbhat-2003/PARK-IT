import express from "express";
import { connectToDatabase, env } from "./config";
import {
  authRouter,
  parkingRoutes,
  orderRoutes,
  paymentRoutes,
  userRoutes,
} from "./routes";
import cors from "cors";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(cors());

app.use(express.json());

app.get("/health", (req: express.Request, res: express.Response) => {
  res.json({ message: `Server is up and running on port ${env.PORT}` });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/parking", parkingRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/users", userRoutes);

connectToDatabase(env.MONGODB_URI)
  .then((connectionInstance) => {
    console.log(
      `Connected to MongoDB at ${connectionInstance.connection.host}`
    );
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
