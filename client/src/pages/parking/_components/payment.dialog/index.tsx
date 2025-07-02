import { useRef, useState, useEffect, useMemo } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import { format, differenceInHours, differenceInDays } from "date-fns";
import { envConfig } from "@/config/env.config";
import { useAppSelector } from "@/hooks/redux-hooks";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router";

interface PaymentDialogProps {
  parkingId: string;
  parkingName: string;
  hourlyRate: number;
  dailyRate: number;
  durationType: "hourly" | "daily";
  duration: number;
  vehicleTypes: string[];
  onPaymentSuccess?: () => void;
  isDisabled: boolean;
}

interface BookingFormValues {
  vehicleType: string;
  vehicleNumber: string;
  endTime: string;
}

export default function PaymentDialog({
  parkingId,
  parkingName,
  hourlyRate,
  dailyRate,
  durationType = "hourly",
  duration = 1,
  vehicleTypes = ["car", "motorcycle", "bus", "truck", "bicycle", "suv", "ev"],
  onPaymentSuccess,
  isDisabled,
}: PaymentDialogProps) {
  const userId = useAppSelector((state) => state.user.id);
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [vehicleNumberError, setVehicleNumberError] = useState<string | null>(
    null,
  );

  // Generate end time options based on duration type and current time
  const generateEndTimeOptions = () => {
    const options = [];
    const now = new Date();
    const startHour = now.getHours();

    if (durationType === "hourly") {
      for (let i = 1; i <= 24; i++) {
        const endTime = new Date(now);
        endTime.setHours(startHour + i);
        const formattedTime = format(endTime, "h:mm a, MMM do");
        options.push({
          value: endTime.toISOString(),
          label: formattedTime,
          hours: i,
        });
      }
    } else {
      for (let i = 1; i <= 7; i++) {
        const endTime = new Date(now);
        endTime.setDate(now.getDate() + i);
        const formattedTime = format(endTime, "h:mm a, MMM do");
        options.push({
          value: endTime.toISOString(),
          label: formattedTime,
          days: i,
        });
      }
    }

    return options;
  };

  const endTimeOptions = generateEndTimeOptions();

  const form = useForm<BookingFormValues>({
    defaultValues: {
      vehicleType: vehicleTypes[0],
      vehicleNumber: "",
      endTime: endTimeOptions[duration - 1]?.value || endTimeOptions[0]?.value,
    },
  });

  // Use useWatch to reactively get form values
  const selectedEndTime = useWatch({
    control: form.control,
    name: "endTime",
  });

  const selectedVehicleType = useWatch({
    control: form.control,
    name: "vehicleType",
  });

  // Calculate dynamic booking summary values
  const bookingSummary = useMemo(() => {
    const now = new Date();
    const endTime = selectedEndTime
      ? new Date(selectedEndTime)
      : new Date(
          now.getTime() +
            duration * (durationType === "hourly" ? 3600000 : 86400000),
        );

    // Calculate the actual duration based on the selected end time
    let actualDuration: number;
    let actualDurationType: "hourly" | "daily";

    const hoursDiff = differenceInHours(endTime, now);
    const daysDiff = differenceInDays(endTime, now);

    if (durationType === "hourly" || hoursDiff < 24) {
      actualDuration = Math.max(1, hoursDiff);
      actualDurationType = "hourly";
    } else {
      actualDuration = Math.max(1, daysDiff);
      actualDurationType = "daily";
    }

    // Calculate the rate based on vehicle type and duration
    // You could adjust rates based on vehicle type if needed
    const baseRate = actualDurationType === "hourly" ? hourlyRate : dailyRate;

    // Optional: Apply vehicle type multipliers
    const vehicleMultiplier = (() => {
      switch (selectedVehicleType) {
        case "car":
          return 1;
        case "motorcycle":
          return 0.7;
        case "bus":
          return 2;
        case "truck":
          return 1.8;
        case "bicycle":
          return 0.5;
        case "suv":
          return 1.2;
        case "ev":
          return 1.1;
        default:
          return 1;
      }
    })();

    const adjustedRate = baseRate * vehicleMultiplier;

    // Calculate total amount
    const totalAmount = Math.ceil(adjustedRate * actualDuration);

    // Format the duration text
    const durationText =
      actualDurationType === "hourly"
        ? `${Math.ceil(actualDuration)} ${
            Math.ceil(actualDuration) === 1 ? "hour" : "hours"
          }`
        : `${Math.ceil(actualDuration)} ${
            Math.ceil(actualDuration) === 1 ? "day" : "days"
          }`;

    // Format the booking period
    const formattedStartTime = format(now, "h:mm a, MMM do");
    const formattedEndTime = format(endTime, "h:mm a, MMM do");

    return {
      parkingName,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      vehicleType: selectedVehicleType,
      duration: durationText,
      rate: adjustedRate.toFixed(2),
      rateUnit: actualDurationType === "hourly" ? "hour" : "day",
      totalAmount: totalAmount.toFixed(2),
      rawDuration: actualDuration,
      rawDurationType: actualDurationType,
      rawAmount: totalAmount,
    };
  }, [
    selectedEndTime,
    selectedVehicleType,
    parkingName,
    hourlyRate,
    dailyRate,
    durationType,
    duration,
  ]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  if (!userId) {
    return <Navigate to="/login" />;
  }

  const handleScroll = () => {
    const content = contentRef.current;
    if (!content) return;

    const scrollPercentage =
      content.scrollTop / (content.scrollHeight - content.clientHeight);
    if (scrollPercentage >= 0.99 && !hasReadToBottom) {
      setHasReadToBottom(true);
    }
  };

  const isValidVehicleNumber = (vehicleNumber: string): boolean => {
    const regex = /^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$/;
    setVehicleNumberError(null);
    if (regex.test(vehicleNumber)) {
      return true;
    } else {
      setVehicleNumberError("Invalid vehicle number");
      return false;
    }
  };

  const createOrder = async () => {
    try {
      setLoading(true);
      const formValues = form.getValues();
      console.log(
        "is vechicle number valid ",
        isValidVehicleNumber(formValues.vehicleNumber),
      );
      if (!isValidVehicleNumber(formValues.vehicleNumber)) {
        toast.error("Vehicle number not valid!!");
        return;
      }

      if (
        !formValues.vehicleNumber &&
        !isValidVehicleNumber(formValues.vehicleNumber)
      ) {
        toast("Please enter valid vehicle number.");
        setLoading(false);
        return null;
      }

      const startTime = new Date();
      const endTime = new Date(formValues.endTime);

      const orderResponse = await axios.post(
        `${envConfig.SERVER_BASE_URL}/orders/create`,
        {
          userId: userId,
          parkingId: parkingId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          vehicleType: formValues.vehicleType,
          vehicleNumber: formValues.vehicleNumber,
          totalAmount: bookingSummary.rawAmount,
          status: "created",
          paymentStatus: "pending",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      return orderResponse.data.data.order;
    } catch (error: unknown) {
      console.error("Order creation failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast(errorMessage);
      setLoading(false);
      return null;
    }
  };

  const initializePayment = async (orderId: string) => {
    try {
      // Initialize payment for the created order
      const paymentResponse = await axios.post(
        `${envConfig.SERVER_BASE_URL}/payments/initialize`,
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const paymentData = paymentResponse.data.data;

      // Configure Razorpay options
      const options = {
        key: paymentData.key_id,
        amount: paymentData.amount * 100, // Amount in paise
        currency: paymentData.currency,
        name: "ParkEasy",
        description: `Parking at ${parkingName} for ${bookingSummary.duration}`, // Use dynamic duration
        order_id: paymentData.razorpayOrderId,
        prefill: {
          name: paymentData.prefill.name,
          email: paymentData.prefill.email,
          contact: paymentData.prefill.contact,
        },
        notes: paymentData.notes,
        theme: {
          color: "#3182ce", // Blue shade
        },
        handler: async function (response: any) {
          try {
            // Verify payment on success
            await axios.post(
              `${envConfig.SERVER_BASE_URL}/payments/verify`,
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              },
            );

            // Close dialog
            setOpen(false);
            setLoading(false);

            // Show success toast
            toast.success("Payment successful!");

            // Navigate to success page or call success callback
            if (onPaymentSuccess) {
              onPaymentSuccess();
            } else {
              navigate("/booking/success", {
                state: {
                  orderId: orderId,
                  paymentId: paymentData.paymentId,
                },
              });
            }
          } catch (error: any) {
            console.error("Payment verification failed:", error);
            toast("Payment verification failed. Please try again.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      // Initialize Razorpay
      const razorpay = new (window as unknown as { Razorpay: any }).Razorpay(
        options,
      );
      razorpay.open();
    } catch (error: any) {
      console.error("Payment initialization failed:", error);
      toast("Failed to initialize payment. Please try again.");
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      const formValues = form.getValues();
      console.log(
        "is vechicle number valid ",
        isValidVehicleNumber(formValues.vehicleNumber),
      );
      if (!isValidVehicleNumber(formValues.vehicleNumber)) {
        toast.error("Vehicle number not valid!!");
        return;
      }

      setOpen(false);

      const order = await createOrder();
      if (order) {
        await initializePayment(order._id);
      }
    } catch (error) {
      toast.error("Something went wrong");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={isDisabled} asChild>
        <Button
          variant={"outline"}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setOpen(true);
          }}
          className="w-full cursor-pointer border-purple-500 text-purple-400 hover:bg-purple-500/10"
        >
          Book Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gray-800/95 border border-purple-500/20">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-purple-500/20 bg-gradient-to-br from-gray-900 to-gray-800 px-8 py-6 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            Complete Your Booking
          </DialogTitle>
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700/50"
          >
            <DialogDescription asChild>
              <div className="space-y-8 p-6">
                {/* Booking Form Section */}
                <div className="bg-gray-800/50 rounded-xl border border-purple-500/20 p-6">
                  <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6 flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-900/50 rounded-full flex items-center justify-center border border-purple-500/30">
                      <span className="text-purple-400 text-sm font-bold">1</span>
                    </div>
                    Vehicle Details
                  </h3>

                  <Form {...form}>
                    <div className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="vehicleType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-300">
                              Vehicle Type
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-gray-700/50 border-purple-500/30 text-gray-300 focus:ring-purple-500/50">
                                  <SelectValue placeholder="Select vehicle type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-800 border-purple-500/20">
                                {vehicleTypes.map((type) => (
                                  <SelectItem
                                    key={type}
                                    value={type}
                                    className="text-gray-300 hover:bg-gray-700/50 focus:bg-gray-700/50"
                                  >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="vehicleNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-300">
                              Vehicle Number
                            </FormLabel>
                            <FormControl>
                              <input
                                {...field}
                                className="flex h-12 w-full rounded-lg border border-purple-500/30 bg-gray-700/50 px-4 py-3 text-sm font-medium text-gray-300 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                                placeholder="Enter vehicle number (e.g., KA01AB1234)"
                              />
                            </FormControl>
                            {vehicleNumberError && (
                              <span className="text-sm text-red-400">{vehicleNumberError}</span>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-300">
                              End Time
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-gray-700/50 border-purple-500/30 text-gray-300 focus:ring-purple-500/50">
                                  <SelectValue placeholder="Select end time" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-800 border-purple-500/20">
                                {endTimeOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="py-3 text-gray-300 hover:bg-gray-700/50 focus:bg-gray-700/50"
                                  >
                                    <div className="flex flex-col">
                                      <span className="font-medium">{option.label}</span>
                                      <span className="text-xs text-gray-400">
                                        Duration:{" "}
                                        {option.hours
                                          ? `${option.hours}h`
                                          : `${option.days}d`}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Form>
                </div>

                {/* Dynamic Booking Summary */}
                <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl border border-purple-500/20 p-6">
                  <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6 flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-900/50 rounded-full flex items-center justify-center border border-purple-500/30">
                      <span className="text-purple-400 text-sm font-bold">2</span>
                    </div>
                    Booking Summary
                  </h3>

                  <div className="bg-gray-800/50 rounded-lg p-5 border border-purple-500/20">
                    <div className="grid gap-4">
                      <div className="flex justify-between items-center py-2 border-b border-purple-500/20">
                        <span className="text-sm font-medium text-gray-400">
                          Parking Space
                        </span>
                        <span className="text-sm font-semibold text-gray-200">
                          {bookingSummary.parkingName}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-purple-500/20">
                        <span className="text-sm font-medium text-gray-400">
                          Vehicle Type
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-200">
                            {selectedVehicleType.charAt(0).toUpperCase() +
                              selectedVehicleType.slice(1)}
                          </span>
                          {selectedVehicleType !== vehicleTypes[0] && (
                            <span className="text-xs bg-purple-900/50 text-purple-400 px-2 py-1 rounded-full font-medium border border-purple-500/30">
                              Rate Adjusted
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-start py-2 border-b border-purple-500/20">
                        <span className="text-sm font-medium text-gray-400">
                          Booking Period
                        </span>
                        <div className="text-right">
                          <div className="text-xs font-medium text-gray-200">
                            {bookingSummary.startTime}
                          </div>
                          <div className="text-xs text-gray-500">to</div>
                          <div className="text-xs font-medium text-gray-200">
                            {bookingSummary.endTime}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-purple-500/20">
                        <span className="text-sm font-medium text-gray-400">
                          Duration
                        </span>
                        <span className="text-sm font-semibold text-gray-200">
                          {bookingSummary.duration}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-purple-500/20">
                        <span className="text-sm font-medium text-gray-400">
                          Rate
                        </span>
                        <span className="text-sm font-semibold text-gray-200">
                          ₹{bookingSummary.rate}/{bookingSummary.rateUnit}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <span className="text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                          Total Amount
                        </span>
                        <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                          ₹{bookingSummary.totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6 flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-900/50 rounded-full flex items-center justify-center border border-purple-500/30">
                      <span className="text-purple-400 text-sm font-bold">3</span>
                    </div>
                    Terms and Conditions
                  </h3>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
                    <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                      Booking Agreement
                    </h4>
                    <p className="text-gray-400">
                      By proceeding with this payment, you agree to book the
                      parking space for the specified duration and comply
                      with all parking rules and regulations.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
                    <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                      Acceptance of Terms
                    </h4>
                    <p className="text-gray-400">
                      By accessing and using this website, users agree to
                      comply with and be bound by these Terms of Service.
                      Users who do not agree with these terms should
                      discontinue use of the website immediately.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
                    <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                      User Account Responsibilities
                    </h4>
                    <p className="text-gray-400">
                      Users are responsible for maintaining the
                      confidentiality of their account credentials. Any
                      activities occurring under a user&lsquo;s account are
                      the sole responsibility of the account holder. Users
                      must notify the website administrators immediately of
                      any unauthorized account access.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
                    <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                      User Conduct Guidelines
                    </h4>
                    <div className="ml-4 space-y-1">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-400">Not upload harmful or malicious content</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-400">Not engage in fraudulent activities</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-400">Not violate any applicable laws or regulations</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </div>

          <DialogFooter className="border-t border-purple-500/20 bg-gradient-to-br from-gray-900 to-gray-800 px-8 py-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={hasReadToBottom}
                  onChange={(e) => setHasReadToBottom(e.target.checked)}
                  className="w-4 h-4 text-purple-500 border-purple-500/30 rounded focus:ring-purple-500/50 bg-gray-700/50"
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  I have read and agree to the terms and conditions
                </label>
              </div>
              <Button
                onClick={handlePayment}
                disabled={!hasReadToBottom || loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="mr-2 animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Processing...
                  </>
                ) : (
                  <>Pay ₹{bookingSummary.totalAmount}</>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
