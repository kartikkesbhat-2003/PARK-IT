// src/pages/BookingConfirmedPage.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router";
import {
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  Download,
  Share2,
  ChevronLeft,
  Home,
  ArrowRight,
} from "lucide-react";

interface BookingDetails {
  slotId: number;
  slotName: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  hours: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  last4?: string;
  type: string;
}

const BookingConfirmedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from location state, or use mock data if not available
  const { bookingDetails, paymentMethod } = location.state || {
    bookingDetails: {
      slotId: 1,
      slotName: "Downtown Secure Parking",
      address: "123 Main St, Downtown",
      date: "2025-04-20",
      startTime: "10:00",
      endTime: "15:00",
      price: 27.5,
      hours: 5,
    },
    paymentMethod: {
      id: "pm_1",
      name: "Visa ending in 4242",
      last4: "4242",
      type: "card",
    },
  };

  // Generate a booking reference number
  const bookingReference = `PK-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`;

  // Format date string to be more readable
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time (24h to 12h format)
  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    console.log("Downloading receipt...");
    alert("Receipt download functionality would be implemented here.");
  };

  const handleGoToHome = () => {
    navigate("/");
  };

  const handleViewBookings = () => {
    navigate("/my-bookings");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button
            onClick={handleGoToHome}
            className="p-2 rounded-full hover:bg-gray-100 mr-2"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Booking Confirmation</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600 mb-4">
              Your parking spot has been successfully booked. We've sent the
              details to your email.
            </p>
            <div className="inline-block border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-center">
              <p className="text-sm text-gray-500">Booking Reference</p>
              <p className="text-lg font-semibold">{bookingReference}</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Parking Details</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {bookingDetails.slotName}
                  </h4>
                  <div className="flex items-start mt-2 text-gray-600">
                    <MapPin size={18} className="flex-shrink-0 mr-2 mt-0.5" />
                    <span>{bookingDetails.address}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <Calendar size={18} className="text-gray-500 mr-2" />
                    <span>{formatDate(bookingDetails.date)}</span>
                  </div>

                  <div className="flex items-center">
                    <Clock size={18} className="text-gray-500 mr-2" />
                    <span>
                      {formatTime(bookingDetails.startTime)} -{" "}
                      {formatTime(bookingDetails.endTime)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Parking Fee ({bookingDetails.hours}{" "}
                    {bookingDetails.hours === 1 ? "hour" : "hours"})
                  </span>
                  <span>${bookingDetails.price.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span>$2.00</span>
                </div>

                <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-semibold">
                  <span>Total Paid</span>
                  <span>${(bookingDetails.price + 2).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Method</span>
                  <span>{paymentMethod.name}</span>
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownloadReceipt}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Download size={18} />
                <span>Download Receipt</span>
              </button>

              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Share2 size={18} />
                <span>Share Details</span>
              </button>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">What's Next?</h3>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">
                    Arrive at the parking location
                  </h4>
                  <p className="text-gray-600 mt-1">
                    Show your booking reference or QR code at the entrance. The
                    attendant will guide you to your assigned spot.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Park your vehicle</h4>
                  <p className="text-gray-600 mt-1">
                    Follow the parking guidelines. Make sure to lock your
                    vehicle and take all valuables with you.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">
                    Return before your booking ends
                  </h4>
                  <p className="text-gray-600 mt-1">
                    Make sure to return before your booking end time to avoid
                    additional charges.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGoToHome}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <Home size={18} />
                <span>Return to Home</span>
              </button>

              <button
                onClick={handleViewBookings}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <span>View All Bookings</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmedPage;
