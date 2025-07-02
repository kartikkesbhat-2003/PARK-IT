import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  ChevronLeft,
  Clock,
  Calendar,
  MapPin,
  CreditCard,
  Lock,
} from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  last4?: string;
  type: "card" | "paypal" | "applePay" | "googlePay";
  isDefault?: boolean;
}

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

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // In a real app, booking details would be passed via location state or Redux
  // For demo purposes, we're creating mock data
  const bookingDetails: BookingDetails = location.state?.bookingDetails || {
    slotId: 1,
    slotName: "Downtown Secure Parking",
    address: "123 Main St, Downtown",
    date: "2025-04-20",
    startTime: "10:00",
    endTime: "15:00",
    price: 27.5,
    hours: 5,
  };

  // Mock saved payment methods
  const savedPaymentMethods: PaymentMethod[] = [
    {
      id: "pm_1",
      name: "Visa ending in 4242",
      last4: "4242",
      type: "card",
      isDefault: true,
    },
    {
      id: "pm_2",
      name: "Mastercard ending in 5555",
      last4: "5555",
      type: "card",
    },
    {
      id: "pm_3",
      name: "PayPal",
      type: "paypal",
    },
  ];

  // State management
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    savedPaymentMethods.find((pm) => pm.isDefault)?.id || ""
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isNewCard, setIsNewCard] = useState<boolean>(false);

  // States for new card inputs
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardName, setCardName] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [cvc, setCvc] = useState<string>("");
  const [saveCard, setSaveCard] = useState<boolean>(true);

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

  // Handle payment submission
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // In a real app, this would handle payment processing with Stripe, PayPal, etc.
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      // Navigate to success page
      navigate("/booking-confirmed", {
        state: {
          bookingDetails,
          paymentMethod: savedPaymentMethods.find(
            (pm) => pm.id === selectedPaymentMethod
          ),
        },
      });
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
      // Handle payment error
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Format card number with spaces
  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

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
          <h1 className="text-xl font-bold">Payment</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

              {!isNewCard ? (
                <>
                  {/* Saved Payment Methods */}
                  <div className="space-y-3 mb-6">
                    {savedPaymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                          selectedPaymentMethod === method.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={() => setSelectedPaymentMethod(method.id)}
                          className="mr-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center">
                          {method.type === "card" && (
                            <CreditCard
                              size={20}
                              className="mr-3 text-gray-600"
                            />
                          )}
                          {method.type === "paypal" && (
                            <div className="w-6 h-6 mr-3 flex items-center justify-center">
                              <svg
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                className="text-blue-700"
                              >
                                <path
                                  fill="currentColor"
                                  d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.003-2.594 6.167-6.667 6.167h-2.188c-.011 0-.02 0-.029.002L10.6 19.9a.653.653 0 0 0 .644.767h4.286c.54 0 .998-.382 1.08-.9l.044-.236.849-5.39.054-.296c.084-.519.541-.9 1.08-.9h.683c4.299 0 7.666-1.747 8.647-6.797.367-1.892.156-3.473-.845-4.591a3.57 3.57 0 0 0-.6-.541c-.494-.398-1.074-.664-1.73-.848V7.5c0-.86-.6-1.645-1.453-1.845-.844-.196-1.705.241-2.047 1.048-.183.438-.18.911.002 1.359.165.424.5.77.93.935z"
                                />
                              </svg>
                            </div>
                          )}
                          <span className="font-medium">{method.name}</span>
                        </div>
                        {method.isDefault && (
                          <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                            Default
                          </span>
                        )}
                      </label>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsNewCard(true)}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <span className="mr-2">+</span> Add new payment method
                  </button>
                </>
              ) : (
                <form onSubmit={handleSubmitPayment}>
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="cardNumber"
                      >
                        Card Number
                      </label>
                      <input
                        id="cardNumber"
                        type="text"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumber(e.target.value))
                        }
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="cardName"
                      >
                        Name on Card
                      </label>
                      <input
                        id="cardName"
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Smith"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-gray-700 mb-2"
                          htmlFor="expiryDate"
                        >
                          Expiry Date
                        </label>
                        <input
                          id="expiryDate"
                          type="text"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          maxLength={5}
                          required
                        />
                      </div>

                      <div>
                        <label
                          className="block text-gray-700 mb-2"
                          htmlFor="cvc"
                        >
                          CVC
                        </label>
                        <input
                          id="cvc"
                          type="text"
                          value={cvc}
                          onChange={(e) =>
                            setCvc(e.target.value.replace(/\D/g, ""))
                          }
                          placeholder="123"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="saveCard"
                        checked={saveCard}
                        onChange={() => setSaveCard(!saveCard)}
                        className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                      />
                      <label htmlFor="saveCard" className="text-gray-700">
                        Save this card for future payments
                      </label>
                    </div>
                  </div>

                  <div className="flex mt-6 gap-4">
                    <button
                      type="button"
                      onClick={() => setIsNewCard(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                      disabled={isProcessing}
                    >
                      Save Card
                    </button>
                  </div>
                </form>
              )}

              {!isNewCard && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleSubmitPayment}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center"
                    disabled={isProcessing || !selectedPaymentMethod}
                  >
                    {isProcessing ? (
                      <>
                        <div className="mr-2 animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Processing...
                      </>
                    ) : (
                      <>Pay ${bookingDetails.price.toFixed(2)}</>
                    )}
                  </button>

                  <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
                    <Lock size={14} className="mr-1" />
                    <span>Secure payment processed by Stripe</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">
                    {bookingDetails.slotName}
                  </h3>
                  <div className="flex items-start mt-2 text-gray-600">
                    <MapPin size={18} className="flex-shrink-0 mr-2 mt-0.5" />
                    <span>{bookingDetails.address}</span>
                  </div>
                </div>

                <div className="space-y-2 pb-4 border-b border-gray-200">
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

                  <div className="flex items-center">
                    <span className="mr-2">📍</span>
                    <span>
                      {bookingDetails.hours}{" "}
                      {bookingDetails.hours === 1 ? "hour" : "hours"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${bookingDetails.price.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Service Fee</span>
                    <span>$2.00</span>
                  </div>

                  <div className="flex justify-between font-semibold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>${(bookingDetails.price + 2).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-start">
                <div className="mr-3 mt-0.5">
                  <InfoIcon color="blue" />
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold">Cancellation Policy</p>
                  <p className="mt-1">
                    Free cancellation up to 2 hours before your booking starts.
                    After that, no refunds will be provided.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper InfoIcon component
const InfoIcon: React.FC<{ color: string }> = ({ color }) => (
  <div
    className={`flex items-center justify-center h-5 w-5 rounded-full bg-${color}-100 text-${color}-600`}
  >
    <span className="text-xs font-bold">i</span>
  </div>
);

export default PaymentPage;
