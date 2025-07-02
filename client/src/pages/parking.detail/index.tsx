import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  MapPin,
  Star,
  Calendar,
  Clock,
  Car,
  Check,
  ChevronLeft,
  DollarSign,
  Share2,
  Heart,
  Phone,
  Info,
  MapIcon,
} from "lucide-react";
import { MapComponent } from "../parking/_components";
import {
  mockParkingSlots,
  vehicleTypeOptions,
  featureOptions,
} from "@/constants";
import { ParkingSlot } from "@/@types";

interface ReviewProps {
  author: string;
  date: string;
  rating: number;
  comment: string;
  avatar?: string;
}

const Review: React.FC<ReviewProps> = ({
  author,
  date,
  rating,
  comment,
  avatar,
}) => {
  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-start">
        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={author}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold">
              {author.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h4 className="font-semibold">{author}</h4>
              <span className="text-sm text-gray-500">{date}</span>
            </div>
            <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full">
              <Star size={14} className="text-yellow-500 mr-1" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>
          <p className="mt-2 text-gray-700">{comment}</p>
        </div>
      </div>
    </div>
  );
};

const reviews: ReviewProps[] = [
  {
    author: "John Doe",
    date: "Oct 15, 2024",
    rating: 4.5,
    comment:
      "Very convenient location with good security. The attendant was helpful when I had trouble with the payment system.",
  },
  {
    author: "Alice Smith",
    date: "Sep 28, 2024",
    rating: 5,
    comment:
      "This is exactly what I needed! Clean, spacious spots and well-lit even at night. Will definitely park here again.",
  },
  {
    author: "Mike Johnson",
    date: "Oct 2, 2024",
    rating: 3.5,
    comment:
      "Decent parking spot but a bit overpriced compared to others in the area. Good location though.",
  },
];

const ParkingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // For a real app with Redux:
  // const dispatch = useDispatch();
  // const { selectedSlot, isLoading, error } = useSelector((state) => state.parking);

  // States for booking
  const [parkingSlot, setParkingSlot] = useState<ParkingSlot | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "reviews" | "booking">(
    "info"
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Get today's date in YYYY-MM-DD format for the date input min attribute
  const today = new Date().toISOString().split("T")[0];

  // Fetch parking slot details
  useEffect(() => {
    if (id) {
      // For a real app with Redux:
      // dispatch(fetchParkingSlotDetails(parseInt(id)));

      // For demo purposes, just find the slot in our mock data:
      const slot = mockParkingSlots.find((slot) => slot._id === id);
      if (slot) {
        setParkingSlot(slot);
      } else {
        // Handle case where slot is not found
        navigate("/parking");
      }
    }
  }, [id, navigate]);

  // Calculate estimated price based on hourly rate and time difference
  const calculatePrice = (): { total: number; hours: number } | null => {
    if (!startTime || !endTime || !parkingSlot) return null;

    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    // Handle case when end time is on the next day
    let hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (hours < 0) {
      hours += 24;
    }

    // Round up to nearest hour
    const roundedHours = Math.ceil(hours);

    // Apply daily rate if more than 8 hours
    let total: number;
    if (roundedHours >= 8) {
      total = parkingSlot.dailyRate;
    } else {
      total = roundedHours * parkingSlot.hourlyRate;
    }

    return { total, hours: roundedHours };
  };

  const estimatedPrice = calculatePrice();
  const isBookingFormValid =
    selectedDate &&
    startTime &&
    endTime &&
    parkingSlot &&
    new Date(`${selectedDate}T${endTime}`) >
      new Date(`${selectedDate}T${startTime}`);

  const handleBookClick = () => {
    if (isBookingFormValid) {
      // In a real app, this would navigate to checkout or payment page
      console.log("Booking:", {
        slotId: parkingSlot?._id,
        date: selectedDate,
        startTime,
        endTime,
        price: estimatedPrice?.total,
      });
      alert("Proceeding to payment...");
      // navigate('/checkout');
    }
  };

  const handleGoBack = () => {
    navigate("/parking");
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (!parkingSlot) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button
            onClick={handleGoBack}
            className="p-2 rounded-full hover:bg-gray-100 mr-2"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Parking Details</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-96">
                <img
                  src={parkingSlot.imageUrl}
                  alt={parkingSlot.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="p-2 bg-white rounded-full shadow-md">
                    <Share2 size={20} />
                  </button>
                  <button
                    className={`p-2 bg-white rounded-full shadow-md ${
                      isFavorite ? "text-red-500" : ""
                    }`}
                    onClick={toggleFavorite}
                  >
                    <Heart
                      size={20}
                      fill={isFavorite ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex border-b">
                <button
                  className={`flex-1 py-3 font-medium text-center ${
                    activeTab === "info"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("info")}
                >
                  Information
                </button>
                <button
                  className={`flex-1 py-3 font-medium text-center ${
                    activeTab === "reviews"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews ({reviews.length})
                </button>
                <button
                  className={`flex-1 py-3 font-medium text-center ${
                    activeTab === "booking"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("booking")}
                >
                  Book Now
                </button>
              </div>

              <div className="p-6">
                {activeTab === "info" && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div>
                      <h2 className="text-2xl font-bold">{parkingSlot.name}</h2>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin size={16} className="mr-1" />
                        <span>{parkingSlot.address}</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          <Star size={16} className="text-yellow-500 mr-1" />
                          <span className="font-medium">
                            {parkingSlot.rating}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({parkingSlot.totalReviews} reviews)
                          </span>
                        </div>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-gray-600">
                          {parkingSlot.distance} miles away
                        </span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-between py-4 border-t border-b border-gray-200">
                      <div>
                        <div className="flex items-center text-gray-600">
                          <Clock size={16} className="mr-2" />
                          <span>Hourly rate</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">
                          ${parkingSlot.hourlyRate.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-600">
                          <Calendar size={16} className="mr-2" />
                          <span>Daily rate</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">
                          ${parkingSlot.dailyRate.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-600">
                          <Car size={16} className="mr-2" />
                          <span>Available spots</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600 mt-1">
                          {parkingSlot.availableSpots}
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold mb-3">Features</h3>
                      <div className="grid grid-cols-2 gap-y-2">
                        {parkingSlot.features.map((feature) => (
                          <div key={feature} className="flex items-center">
                            <Check size={16} className="text-green-500 mr-2" />
                            <span>
                              {
                                featureOptions.find((f) => f.id === feature)
                                  ?.label
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Vehicle Types */}
                    <div className="py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold mb-3">Accepts</h3>
                      <div className="flex flex-wrap gap-2">
                        {parkingSlot.vehicleTypes.map((type) => (
                          <span
                            key={type}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                          >
                            {
                              vehicleTypeOptions.find((v) => v.id === type)
                                ?.label
                            }
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="py-4">
                      <h3 className="text-lg font-semibold mb-3">
                        Additional Information
                      </h3>
                      <p className="text-gray-700">
                        Conveniently located in the heart of the city, this
                        parking space offers secure and reliable parking options
                        for various vehicle types. Monitored 24/7 with security
                        cameras and professional staff to ensure the safety of
                        your vehicle.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Customer Reviews
                      </h3>
                      <div className="flex items-center">
                        <Star size={18} className="text-yellow-500 mr-1" />
                        <span className="font-semibold">
                          {parkingSlot.rating}
                        </span>
                        <span className="text-gray-500 ml-1">
                          ({parkingSlot.totalReviews} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {reviews.map((review, index) => (
                        <Review key={index} {...review} />
                      ))}
                    </div>

                    <button className="w-full py-2 mt-4 border border-gray-300 rounded-lg text-blue-600 font-medium hover:bg-blue-50">
                      Read all reviews
                    </button>
                  </div>
                )}

                {activeTab === "booking" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">
                      Book {parkingSlot.name}
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label
                          className="block text-gray-700 mb-2"
                          htmlFor="date"
                        >
                          Select Date
                        </label>
                        <input
                          id="date"
                          type="date"
                          min={today}
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-gray-700 mb-2"
                            htmlFor="startTime"
                          >
                            Start Time
                          </label>
                          <input
                            id="startTime"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label
                            className="block text-gray-700 mb-2"
                            htmlFor="endTime"
                          >
                            End Time
                          </label>
                          <input
                            id="endTime"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>

                      {startTime && endTime && (
                        <div className="p-4 bg-gray-50 rounded-lg mt-4">
                          <h3 className="font-semibold mb-2">Estimated Cost</h3>
                          {estimatedPrice !== null ? (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700">Duration</span>
                                <span>
                                  {estimatedPrice.hours}{" "}
                                  {estimatedPrice.hours === 1
                                    ? "hour"
                                    : "hours"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700">Rate</span>
                                <span>
                                  $
                                  {estimatedPrice.hours >= 8
                                    ? `${parkingSlot.dailyRate.toFixed(
                                        2
                                      )} (daily rate)`
                                    : `${parkingSlot.hourlyRate.toFixed(
                                        2
                                      )}/hour`}
                                </span>
                              </div>
                              <div className="border-t border-gray-200 pt-2 mt-2"></div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700 font-semibold">
                                  Total
                                </span>
                                <div className="flex items-center text-xl font-bold">
                                  <DollarSign size={18} />
                                  <span>{estimatedPrice.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-yellow-600">
                              Please select valid times to see estimated cost
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold mb-3">Location</h3>
              <div className="h-48 rounded-lg overflow-hidden">
                <MapComponent
                  parkingSlots={[parkingSlot]}
                  userLocation={{ lat: 40.7128, lng: -74.006 }}
                />
              </div>
              <button className="flex items-center justify-center w-full mt-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <MapIcon size={16} className="mr-2" />
                Get Directions
              </button>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold mb-3">Contact</h3>
              <button className="flex items-center w-full py-2 mb-2 border border-gray-300 rounded-lg justify-center text-blue-600 hover:bg-blue-50">
                <Phone size={16} className="mr-2" />
                Call Parking Support
              </button>
              <button className="flex items-center w-full py-2 border border-gray-300 rounded-lg justify-center text-blue-600 hover:bg-blue-50">
                <Info size={16} className="mr-2" />
                Request Information
              </button>
            </div>

            {/* Booking Box */}
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-6">
              <h3 className="font-semibold mb-3">Book This Spot</h3>

              <div className="flex items-center justify-between py-3 border-t border-b border-gray-200">
                <div>
                  <span className="text-gray-600">Price</span>
                  <div className="font-bold text-xl">
                    ${parkingSlot.hourlyRate.toFixed(2)}
                    <span className="text-sm font-normal">/hour</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Available</span>
                  <div className="font-bold text-xl text-green-600">
                    {parkingSlot.availableSpots}{" "}
                    <span className="text-sm font-normal">spots</span>
                  </div>
                </div>
              </div>

              {activeTab !== "booking" ? (
                <button
                  onClick={() => setActiveTab("booking")}
                  className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Book Now
                </button>
              ) : (
                <button
                  onClick={handleBookClick}
                  disabled={!isBookingFormValid}
                  className={`w-full mt-4 py-3 rounded-lg font-medium transition ${
                    isBookingFormValid
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isBookingFormValid
                    ? "Proceed to Payment"
                    : "Complete Booking Details"}
                </button>
              )}

              <p className="text-xs text-gray-500 text-center mt-2">
                You won't be charged until you complete your booking
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingDetailPage;
