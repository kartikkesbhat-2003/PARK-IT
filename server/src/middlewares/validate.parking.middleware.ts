import { body } from "express-validator";

export const validateCreateParking = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be between 3 and 100 characters"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Address must be between 5 and 200 characters"),

  body("distance")
    .notEmpty()
    .withMessage("Distance is required")
    .isFloat({ min: 0 })
    .withMessage("Distance must be a positive number"),

  body("hourlyRate")
    .notEmpty()
    .withMessage("Hourly rate is required")
    .isFloat({ min: 0 })
    .withMessage("Hourly rate must be a positive number"),

  body("dailyRate")
    .notEmpty()
    .withMessage("Daily rate is required")
    .isFloat({ min: 0 })
    .withMessage("Daily rate must be a positive number"),

  body("availableSpots")
    .notEmpty()
    .withMessage("Available spots is required")
    .isInt({ min: 0 })
    .withMessage("Available spots must be a non-negative integer"),

  body("vehicleTypes")
    .notEmpty()
    .withMessage("Vehicle types are required")
    .custom((value) => {
      const types = Array.isArray(value)
        ? value
        : value.split(",").map((item: string) => item.trim());
      const validTypes = ["car", "motorcycle", "bus", "truck", "bicycle"];

      if (!types.every((type: string) => validTypes.includes(type))) {
        throw new Error(
          "Invalid vehicle type. Valid types: car, motorcycle, bus, truck, bicycle"
        );
      }

      return true;
    }),

  body("features")
    .notEmpty()
    .withMessage("Features are required")
    .custom((value) => {
      const features = Array.isArray(value)
        ? value
        : value.split(",").map((item: string) => item.trim());
      const validFeatures = [
        "covered",
        "security",
        "cctv",
        "ev_charging",
        "handicap",
        "valet",
      ];

      if (
        !features.every((feature: string) => validFeatures.includes(feature))
      ) {
        throw new Error(
          "Invalid feature. Valid features: covered, security, cctv, ev_charging, handicap, valet"
        );
      }

      return true;
    }),

  body("lat")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),

  body("lng")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
];

export const validateUpdateParking = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be between 3 and 100 characters"),

  body("address")
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Address must be between 5 and 200 characters"),

  body("distance")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Distance must be a positive number"),

  body("hourlyRate")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Hourly rate must be a positive number"),

  body("dailyRate")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Daily rate must be a positive number"),

  body("availableSpots")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Available spots must be a non-negative integer"),

  body("vehicleTypes")
    .optional()
    .custom((value) => {
      const types = Array.isArray(value)
        ? value
        : value.split(",").map((item: string) => item.trim());
      const validTypes = ["car", "motorcycle", "bus", "truck", "bicycle"];

      if (!types.every((type: string) => validTypes.includes(type))) {
        throw new Error(
          "Invalid vehicle type. Valid types: car, motorcycle, bus, truck, bicycle"
        );
      }

      return true;
    }),

  body("features")
    .optional()
    .custom((value) => {
      const features = Array.isArray(value)
        ? value
        : value.split(",").map((item: string) => item.trim());
      const validFeatures = [
        "covered",
        "security",
        "cctv",
        "ev_charging",
        "handicap",
        "valet",
      ];

      if (
        !features.every((feature: string) => validFeatures.includes(feature))
      ) {
        throw new Error(
          "Invalid feature. Valid features: covered, security, cctv, ev_charging, handicap, valet"
        );
      }

      return true;
    }),

  body("lat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),

  body("lng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];


