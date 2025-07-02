import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Car,
  Calendar,
  CreditCard,
  Info,
  Filter,
  RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";
import { envConfig } from "@/config/env.config";

interface Order {
  _id: string;
  parkingId: {
    _id: string;
    name: string;
    address: string;
    hourlyRate: number;
    features?: string[];
    imageUrl?: string;
  };
  startTime: string;
  endTime: string;
  status:
    | "created"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "pendingApproval";
  vehicleType: string;
  vehicleNumber: string;
  totalAmount: number;
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    orders: Order[];
    count: number;
  };
}

const ActiveOrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processingOrders, setProcessingOrders] = useState<Set<string>>(
    new Set()
  );
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${envConfig.SERVER_BASE_URL}/orders/active`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(data.data.orders);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderAction = async (orderId: string, approve: boolean) => {
    setProcessingOrders((prev) => new Set(prev).add(orderId));

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${envConfig.SERVER_BASE_URL}/orders/${orderId}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ approve }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to process order");
      }

      // Update the order in the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: data.data.order.status,
              }
            : order
        )
      );

      toast.success(
        approve ? "Order accepted successfully" : "Order declined successfully"
      );
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMsg);
      toast.error(`Failed to process order: ${errorMsg}`);
    } finally {
      setProcessingOrders((prev) => {
        const updated = new Set(prev);
        updated.delete(orderId);
        return updated;
      });
    }
  };

  const formatDateTime = (dateString: string): string => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy h:mm a");
    } catch (e) {
      return "Invalid date";
    }
  };

  const calculateDuration = (start: string, end: string): string => {
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diffInMs = Math.abs(endDate.getTime() - startDate.getTime());
      const hours = Math.floor(diffInMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

      return `${hours}h ${minutes}m`;
    } catch (e) {
      return "N/A";
    }
  };

  const StatusBadge: React.FC<{ status: Order["status"] }> = ({ status }) => {
    switch (status) {
      case "created":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-400 border border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            New
          </span>
        );
      case "pendingApproval":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-400 border border-purple-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Pending Approval
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-900/50 text-green-400 border border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-400 border border-blue-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-900/50 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-900/50 text-gray-400 border border-gray-500/30">
            Unknown
          </span>
        );
    }
  };

  const PaymentStatusBadge: React.FC<{ status: Order["paymentStatus"] }> = ({
    status,
  }) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-900/50 text-green-400 border border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-400 border border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Payment Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-900/50 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Payment Failed
          </span>
        );
      default:
        return null;
    }
  };

  // Get vehicle type icon
  const getVehicleIcon = (type: string) => {
    // You can customize with different vehicle icons based on type
    return <Car className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />;
  };

  // Filter orders based on selected status
  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") return true;
    return order.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-gray-400">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-500/30 rounded-md p-4 mb-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-200">
              Error loading orders
            </h3>
            <div className="mt-2 text-sm text-red-300">{error}</div>
            <button
              onClick={fetchOrders}
              className="mt-3 px-3 py-1 bg-gray-800 border border-red-500/30 rounded-md text-sm text-red-300 hover:bg-red-900/30"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-purple-500/20 overflow-hidden">
      <div className="px-6 py-4 border-b border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-100">
              My Parking Orders
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Review and manage your parking reservations
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 bg-gray-700/50 rounded-md hover:bg-gray-600/50 transition-colors border border-purple-500/20"
              aria-label="Filter orders"
            >
              <Filter className="h-5 w-5 text-gray-300" />
            </button>
            <button
              onClick={fetchOrders}
              className="p-2 bg-gray-700/50 rounded-md hover:bg-gray-600/50 transition-colors border border-purple-500/20"
              aria-label="Refresh orders"
            >
              <RefreshCcw className="h-5 w-5 text-gray-300" />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-3 bg-gray-700/50 rounded-md border border-purple-500/20">
            <div className="text-sm font-medium text-gray-300 mb-2">
              Filter by status:
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filterStatus === "all"
                    ? "bg-purple-900/50 text-purple-400 border border-purple-500/30"
                    : "bg-gray-800/50 border border-purple-500/20 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setFilterStatus("created")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filterStatus === "created"
                    ? "bg-yellow-900/50 text-yellow-400 border border-yellow-500/30"
                    : "bg-gray-800/50 border border-purple-500/20 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                New
              </button>
              <button
                onClick={() => setFilterStatus("pendingApproval")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filterStatus === "pendingApproval"
                    ? "bg-purple-900/50 text-purple-400 border border-purple-500/30"
                    : "bg-gray-800/50 border border-purple-500/20 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                Pending Approval
              </button>
              <button
                onClick={() => setFilterStatus("confirmed")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filterStatus === "confirmed"
                    ? "bg-green-900/50 text-green-400 border border-green-500/30"
                    : "bg-gray-800/50 border border-purple-500/20 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setFilterStatus("completed")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filterStatus === "completed"
                    ? "bg-blue-900/50 text-blue-400 border border-blue-500/30"
                    : "bg-gray-800/50 border border-purple-500/20 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilterStatus("cancelled")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filterStatus === "cancelled"
                    ? "bg-red-900/50 text-red-400 border border-red-500/30"
                    : "bg-gray-800/50 border border-purple-500/20 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="p-8 text-center">
          <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-700/50 rounded-full mb-4 border border-purple-500/20">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-200 mb-2">
            No orders found
          </h3>
          <p className="text-gray-400 max-w-md mx-auto">
            {filterStatus !== "all"
              ? `You don't have any ${filterStatus} parking orders.`
              : "You don't have any active parking orders at the moment."}
          </p>
          {filterStatus !== "all" && (
            <button
              onClick={() => setFilterStatus("all")}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              View All Orders
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-purple-500/20">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="p-5 hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-start">
                    {order.parkingId.imageUrl ? (
                      <div className="w-16 h-16 bg-gray-700/50 rounded-md overflow-hidden mr-3 flex-shrink-0 border border-purple-500/20">
                        <img
                          src={
                            "https://media.istockphoto.com/id/1083622428/vector/car-parking-icon.jpg?s=612x612&w=0&k=20&c=Z6VydNYDHrBq6gujhSuC6eIaCXQn_eMHNBFf8Co0ul4="
                          }
                          alt={order.parkingId.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-700/50 rounded-md mr-3 flex-shrink-0 flex items-center justify-center border border-purple-500/20">
                        <MapPin className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-100">
                        {order.parkingId.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {order.parkingId.address}
                      </div>
                      {order.parkingId.features &&
                        order.parkingId.features.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {order.parkingId.features.map((feature) => (
                              <span
                                key={feature}
                                className="px-2 py-0.5 bg-gray-700/50 text-gray-300 rounded-full text-xs border border-purple-500/20"
                              >
                                {feature.replace("_", " ")}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:ml-2">
                  <StatusBadge status={order.status} />
                  {order.paymentStatus && (
                    <PaymentStatusBadge status={order.paymentStatus} />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-700/50 p-3 rounded border border-purple-500/20">
                  <span className="block text-xs font-medium text-gray-400 uppercase mb-2">
                    <Calendar className="inline w-3 h-3 mr-1" />
                    Parking Duration
                  </span>
                  <div className="text-sm text-gray-300">
                    <div>
                      <span className="font-medium">From:</span>{" "}
                      {formatDateTime(order.startTime)}
                    </div>
                    <div>
                      <span className="font-medium">To:</span>{" "}
                      {formatDateTime(order.endTime)}
                    </div>
                    <div className="mt-1 text-purple-400 font-medium">
                      {calculateDuration(order.startTime, order.endTime)}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/50 p-3 rounded border border-purple-500/20">
                  <span className="block text-xs font-medium text-gray-400 uppercase mb-2">
                    <Car className="inline w-3 h-3 mr-1" />
                    Vehicle Details
                  </span>
                  <div className="flex items-start">
                    {getVehicleIcon(order.vehicleType)}
                    <div className="text-gray-300">
                      <div className="text-sm">
                        <span className="font-medium">Type:</span>{" "}
                        {order.vehicleType.charAt(0).toUpperCase() +
                          order.vehicleType.slice(1)}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Number:</span>{" "}
                        <span className="font-mono">
                          {order.vehicleNumber.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/50 p-3 rounded border border-purple-500/20">
                  <span className="block text-xs font-medium text-gray-400 uppercase mb-2">
                    <CreditCard className="inline w-3 h-3 mr-1" />
                    Payment Details
                  </span>
                  <div className="text-sm text-gray-300">
                    <div>
                      <span className="font-medium">Amount:</span> ₹
                      {order.totalAmount.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Rate:</span> ₹
                      {order.parkingId.hourlyRate}/hour
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      <Clock className="inline w-3 h-3 mr-1" />
                      Booked on{" "}
                      {format(
                        new Date(order.createdAt || Date.now()),
                        "dd MMM yyyy"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-purple-500/20 pt-4">
                <div>
                  {order.status === "created" && (
                    <div className="flex items-center">
                      <Info className="h-4 w-4 text-purple-400 mr-2" />
                      <span className="text-sm text-purple-300">
                        This order requires your approval
                      </span>
                    </div>
                  )}
                  {order.status === "pendingApproval" && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-purple-400 mr-2" />
                      <span className="text-sm text-purple-300">
                        Waiting for parking owner's approval
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col xs:flex-row gap-2">
                  {order.status === "pendingApproval" && (
                    <>
                      <button
                        onClick={() => handleOrderAction(order._id, false)}
                        disabled={processingOrders.has(order._id)}
                        className="px-4 py-2 border border-red-500/30 cursor-pointer text-red-400 rounded-md hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                      >
                        {processingOrders.has(order._id)
                          ? "Processing..."
                          : "Decline"}
                      </button>
                      <button
                        onClick={() => handleOrderAction(order._id, true)}
                        disabled={processingOrders.has(order._id)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white cursor-pointer rounded-md hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 active:scale-95"
                      >
                        {processingOrders.has(order._id)
                          ? "Processing..."
                          : "Accept"}
                      </button>
                    </>
                  )}

                  {order.status !== "created" && (
                    <div className="text-sm text-gray-400 italic">
                      {order.status === "confirmed" && "Order confirmed"}
                      {order.status === "completed" && "Order completed"}
                      {order.status === "cancelled" && "Order cancelled"}
                      {order.status === "pendingApproval" &&
                        "Waiting for owner's approval"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveOrdersList;
