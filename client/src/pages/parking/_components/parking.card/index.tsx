import React from "react";
import { MapPin, Star } from "lucide-react";
import { ParkingSlot } from "@/@types";
import { Link } from "react-router";
import PaymnetDialog from "../payment.dialog";

interface ParkingCardProps {
  slot: ParkingSlot;
  onBookNow: (slotId: string) => void;
}

const ParkingCard: React.FC<ParkingCardProps> = ({ slot }) => {
  if (slot.availableSpots === 0) return null;
  return (
    <div className="bg-gray-800/50 rounded-lg shadow-lg border border-purple-500/20 overflow-hidden hover:shadow-purple-500/10 transition">
      <Link to={`/parking/${slot._id}`} className="relative">
        <img
          src={`https://d28fpa5kkce5uk.cloudfront.net/${slot.imageUrl}`}
          alt={slot.name}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-3 right-3 bg-gray-800/90 px-2 py-1 rounded-full text-xs font-medium text-purple-400 border border-purple-500/30">
          ₹{slot.hourlyRate}/hr
        </div>
      </Link>

      <div className="p-3 flex flex-col gap-2">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-100 text-nowrap max-w-[140px] truncate">
              {slot.name}
            </h3>
            <div className="flex items-center bg-purple-900/50 px-2 py-1 rounded-full border border-purple-500/30">
              <Star size={16} className="text-yellow-500 mr-1" />
              <span className="text-sm font-medium text-gray-100">{slot.rating}</span>
              <span className="text-xs text-gray-400 ml-1">
                ({slot.totalReviews})
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-start gap-1">
            <MapPin size={18} className="text-purple-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-300">
              {slot.address} ({slot.distanceInKm.toFixed(2)} KM away)
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {slot.features.slice(0, 3).map((feature) => {
              if (feature.length > 0) {
                return (
                  <span
                    key={feature}
                    className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full shrink-0 border border-purple-500/20"
                  >
                    {feature}
                  </span>
                );
              } else {
                return null;
              }
            })}
          </div>

          <div className="mt-4 flex flex-col gap-1 grow">
            <div
              className={`flex items-center ${
                slot.availableSpots > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              <span className="font-medium text-[13px]">
                {slot.availableSpots} spots available
              </span>
            </div>

            <PaymnetDialog
              parkingId={slot._id}
              parkingName={slot.name}
              hourlyRate={slot.hourlyRate}
              dailyRate={slot.dailyRate}
              durationType="hourly"
              duration={2}
              vehicleTypes={slot.vehicleTypes}
              onPaymentSuccess={() => {
                console.log("Payment successful!");
              }}
              isDisabled={slot.availableSpots <= 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingCard;
