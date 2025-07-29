import { Request, Response } from "express";
import createHttpError from "http-errors";
import { asyncHandler } from "../../utils";
import { Parking } from "../../models/parking.model";
import { uploadToS3 } from "../../services/s3.service";
import { authenticationServices } from "../../services";
import { IRequestWithUser } from "../../@types";

export const parkingControllers = {
  createParkingSlot: asyncHandler(
    async (req: IRequestWithUser, res: Response) => {
      const userId = req.customUser?._id;

      if (!userId) {
        throw createHttpError(401, "Unauthorized");
      }

      const user = await authenticationServices.findUserById(userId);
      if (!user) {
        throw createHttpError(404, "User not found");
      }

      if (user.role !== "owner") {
        throw createHttpError(
          403,
          "Only parking owners can create parking spots"
        );
      }

      if (user.isBlocked || user.isDeleted) {
        throw createHttpError(403, "Your account is blocked or deleted");
      }

      // Properly transform coordinates to GeoJSON format
      const parkingData = {
        ...req.body,
        imageUrl: req.body.imageUrl,
        owner: userId,
        coordinates: {
          type: "Point",
          coordinates: [
            parseFloat(req.body.coordinates.lng), // longitude first in GeoJSON
            parseFloat(req.body.coordinates.lat), // latitude second
          ],
        },
      };

      if (typeof parkingData.vehicleTypes === "string") {
        parkingData.vehicleTypes = parkingData.vehicleTypes
          .split(",")
          .map((item: string) => item.trim());
      }

      if (typeof parkingData.features === "string") {
        parkingData.features = parkingData.features
          .split(",")
          .map((item: string) => item.trim());
      }

      const newParking = await Parking.create(parkingData);

      res.status(201).json({
        success: true,
        data: newParking,
      });
    }
  ),

  // Added actual listParkingSlots controller
  listParkingSlots: asyncHandler(
    async (req: IRequestWithUser, res: Response) => {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = -1,
        owner,
      } = req.query;

      const parsedPage = parseInt(page as string);
      const parsedLimit = parseInt(limit as string);
      const skip = (parsedPage - 1) * parsedLimit;

      const query: any = { isDeleted: false };

      // If owner ID provided, filter by owner
      if (owner) {
        query.owner = owner;
      }

      // If authenticated user is an owner, only show their listings
      if (req.customUser?.userType === "owner") {
        query.owner = req.customUser._id;
      }

      const sortOptions: any = {};
      sortOptions[sortBy as string] = parseInt(sortOrder as string);

      const parkingSlots = await Parking.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parsedLimit)
        .select("-__v");

      const totalCount = await Parking.countDocuments(query);

      res.status(200).json({
        success: true,
        count: parkingSlots.length,
        totalPages: Math.ceil(totalCount / parsedLimit),
        currentPage: parsedPage,
        data: parkingSlots,
      });
    }
  ),

  uploadFileToS3: asyncHandler(async (req: IRequestWithUser, res: Response) => {
    if (!req.file) {
      throw createHttpError(400, "Image file is required");
    }
    const imageUrl = await uploadToS3(req.file.path);
    res.status(201).json({
      success: true,
      data: imageUrl,
    });
  }),

  getNearByParkingSpaces: asyncHandler(
    async (req: IRequestWithUser, res: Response) => {
      const { lat, lng, limit = 10, maxDistance = 5000000000 } = req.query;

      const parsedLimit = parseInt(limit as string);
      const parsedMaxDistance = parseInt(maxDistance as string);

      // Case 1: lat/lng not provided — return all active, non-deleted parking spaces in same format
      if (!lat || !lng) {
        const allParkingSpaces = await Parking.find({
          isActive: true,
          isDeleted: false,
        })
          .limit(parsedLimit)
          .select({
            _id: 1,
            name: 1,
            address: 1,
            hourlyRate: 1,
            dailyRate: 1,
            rating: 1,
            totalReviews: 1,
            availableSpots: 1,
            vehicleTypes: 1,
            features: 1,
            imageUrl: 1,
            coordinates: 1,
          });

        const formattedData = allParkingSpaces.map((space) => ({
          ...space.toObject(),
          distance: 0,
          distanceInKm: 0,
        }));

        return res.status(200).json({
          success: true,
          count: formattedData.length,
          data: formattedData,
        });
      }

      // Case 2: lat/lng provided — perform geospatial query
      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({
          success: false,
          message: "Invalid latitude or longitude format",
        });
      }

      // Fixed geospatial query using proper GeoJSON format
      const parkingSpaces = await Parking.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [longitude, latitude] }, // GeoJSON uses [lng, lat]
            distanceField: "distance",
            maxDistance: parsedMaxDistance,
            spherical: true,
            query: { isActive: true, isDeleted: false },
          },
        },
        { $limit: parsedLimit },
        {
          $project: {
            _id: 1,
            name: 1,
            address: 1,
            hourlyRate: 1,
            dailyRate: 1,
            rating: 1,
            totalReviews: 1,
            availableSpots: 1,
            vehicleTypes: 1,
            features: 1,
            imageUrl: 1,
            coordinates: 1,
            distance: 1,
            distanceInKm: { $divide: ["$distance", 1000] },
          },
        },
      ]);

      return res.status(200).json({
        success: true,
        count: parkingSpaces.length,
        data: parkingSpaces,
      });
    }
  ),

  // Added a new controller to get a single parking slot by ID
  getParkingSlotById: asyncHandler(
    async (req: IRequestWithUser, res: Response) => {
      const { id } = req.params;

      const parkingSlot = await Parking.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!parkingSlot) {
        throw createHttpError(404, "Parking slot not found");
      }

      res.status(200).json({
        success: true,
        data: parkingSlot,
      });
    }
  ),

  // Added a new controller to update a parking slot
  updateParkingSlot: asyncHandler(
    async (req: IRequestWithUser, res: Response) => {
      const { id } = req.params;
      const userId = req.customUser?._id;

      if (!userId) {
        throw createHttpError(401, "Unauthorized");
      }

      const parkingSlot = await Parking.findById(id);

      if (!parkingSlot) {
        throw createHttpError(404, "Parking slot not found");
      }

      // Check if user is the owner of this parking slot
      if (parkingSlot.owner.toString() !== userId) {
        throw createHttpError(
          403,
          "You can only update your own parking slots"
        );
      }

      // Handle coordinates update if provided
      if (req.body.coordinates) {
        req.body.coordinates = {
          type: "Point",
          coordinates: [
            parseFloat(req.body.coordinates.lng),
            parseFloat(req.body.coordinates.lat),
          ],
        };
      }

      // Process arrays if they come as strings
      if (typeof req.body.vehicleTypes === "string") {
        req.body.vehicleTypes = req.body.vehicleTypes
          .split(",")
          .map((item: string) => item.trim());
      }

      if (typeof req.body.features === "string") {
        req.body.features = req.body.features
          .split(",")
          .map((item: string) => item.trim());
      }

      const updatedParking = await Parking.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        data: updatedParking,
      });
    }
  ),

  // Added a new controller to delete a parking slot (soft delete)
  deleteParkingSlot: asyncHandler(
    async (req: IRequestWithUser, res: Response) => {
      const { id } = req.params;
      const userId = req.customUser?._id;

      if (!userId) {
        throw createHttpError(401, "Unauthorized");
      }

      const parkingSlot = await Parking.findById(id);

      if (!parkingSlot) {
        throw createHttpError(404, "Parking slot not found");
      }

      // Check if user is the owner of this parking slot
      if (parkingSlot.owner.toString() !== userId) {
        throw createHttpError(
          403,
          "You can only delete your own parking slots"
        );
      }

      // Soft delete
      await Parking.findByIdAndUpdate(id, { isDeleted: true });

      res.status(200).json({
        success: true,
        message: "Parking slot deleted successfully",
      });
    }
  ),
  // get all parking slot listed by a particular user owner
  getParkingSlotsByOwner: asyncHandler(
    async (req: IRequestWithUser, res: Response) => {
      const userId = req.customUser?._id;
      if (!userId) {
        throw createHttpError(401, "Unauthorized");
      }
      const parkingSlots = await Parking.find({
        owner: userId,
        isDeleted: false,
      });
      res.status(200).json({
        success: true,
        count: parkingSlots.length,
        data: parkingSlots,
      });
    }
  ),
};
