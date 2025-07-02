export interface Coordinates {
  type: string;
  coordinates: [number, number]; // [longitude, latitude] for GeoJSON format
}

export interface ParkingSlot {
  _id: string;
  name: string;
  address: string;
  distance: number;
  hourlyRate: number;
  dailyRate: number;
  rating: number;
  totalReviews: number;
  availableSpots: number;
  vehicleTypes: string[];
  features: string[];
  imageUrl: string;
  coordinates: Coordinates;
  distanceInKm: number;
}

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterState {
  vehicleTypes: string[];
  features: string[];
  priceRange: [number, number];
  maxDistance: number;
  minRating: number;
}

export const enum ActionTypes {
  REGISTER_USER = "register",
  LOGIN_USER = "login",
}
