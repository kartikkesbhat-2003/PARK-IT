import React from "react";

export const SpotCard = ({ spot }) => {
    return (
        <div className="border p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">{spot.location}</h3>
            <p className="text-sm text-gray-500">Size: {spot.spotSize}</p>
            <p className={`text-sm ${spot.availabilityStatus === "Available" ? "text-green-500" : "text-red-500"}`}>
                {spot.availabilityStatus}
            </p>
            <p className="text-sm font-medium">₹{spot.pricePerHour}/hour</p>
        </div>
    );
};


