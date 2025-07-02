import express from "express";
import { parkingControllers } from "../controllers/parking";
import upload from "../middlewares/upload.middleware";
import { parkerAuthMiddleware } from "../middlewares/owner.middleware";

export const parkingRoutes = express.Router();

// Route naming and HTTP methods updated to follow REST conventions

// Create a new parking spot (previously incorrectly named as list-parking-spots)
parkingRoutes.post(
  "/create",
  parkerAuthMiddleware,
  parkingControllers.createParkingSlot // renamed from listParkingSlots to createParkingSlot
);

// Get list of parking spots (new route for the actual listing functionality)
parkingRoutes.get("/", parkingControllers.listParkingSlots);

parkingRoutes.get("/nearby/spots", parkingControllers.getNearByParkingSpaces);

// Get parking spot by ID
parkingRoutes.get("/:id", parkingControllers.getParkingSlotById);

// Update parking spot
parkingRoutes.put(
  "/:id",
  parkerAuthMiddleware,
  parkingControllers.updateParkingSlot
);

// Delete parking spot
parkingRoutes.delete(
  "/:id",
  parkerAuthMiddleware,
  parkingControllers.deleteParkingSlot
);

// Upload image for parking spot
parkingRoutes.post(
  "/upload",
  parkerAuthMiddleware,
  upload.single("file"),
  parkingControllers.uploadFileToS3
);

// Get nearby parking spots
parkingRoutes.get("/nearby", parkingControllers.getNearByParkingSpaces);

parkingRoutes.get(
  "/all/active",
  parkerAuthMiddleware,
  parkingControllers.getParkingSlotsByOwner
);
