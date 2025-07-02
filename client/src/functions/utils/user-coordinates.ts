export interface Coordinates {
  latitude: number;
  longitude: number;
  source: "geolocation" | "default";
}

const DEFAULT_COORDINATES: Coordinates = {
  latitude: 18.563072, // Example: Patna, Bihar
  longitude: 73.8295808,
  source: "default",
};

export const getUserCoordinates = (): Promise<Coordinates> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return resolve(DEFAULT_COORDINATES);
    }

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        resolve({
          latitude,
          longitude,
          source: "geolocation",
        });
      },
      () => {
        // Any error just returns default
        resolve(DEFAULT_COORDINATES);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
};
