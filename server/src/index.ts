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

// Configure CORS for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-netlify-app.netlify.app', 'https://your-custom-domain.com'] // Replace with your actual Netlify domain
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(express.json());

app.get("/health", (req: express.Request, res: express.Response) => {
  res.json({ message: `Server is up and running on port ${env.PORT}` });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/parking", parkingRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/users", userRoutes);

// Handle 404
app.use("*", (req: express.Request, res: express.Response) => {
  res.status(404).json({ message: "Route not found" });
});

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
