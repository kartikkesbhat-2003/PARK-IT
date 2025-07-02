import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { envConfig } from "../config/env.config";
import { resetUserAction, setUserAction } from "@/redux/slices/user.slice";
import { setOrderAction } from "@/redux/slices/order.slice";

interface AuthContextType {
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        dispatch(resetUserAction());
        return;
      }

      const response = await axios.get(
        `${envConfig.SERVER_BASE_URL}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const userData = response.data.data.user;
        const activeOrderData = response.data.data.activeOrder;

        dispatch(
          setUserAction({
            id: userData._id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            avatarImage: userData.avatar || "",
            isLoggedIn: true,
          })
        );

        const activeOrderDetails = {
          orderId: activeOrderData?.orderId || null,
          orderStatus: activeOrderData?.status || null,
          remainingTime: {
            hours: activeOrderData?.remainingTime?.hours || 0,
            minutes: activeOrderData?.remainingTime?.minutes || 0,
            text: activeOrderData?.remainingTime?.text || "",
            expired: activeOrderData?.remainingTime?.expired || false,
          },
          vehicleNumber: activeOrderData?.vehicleNumber || null,
          vehicleType: activeOrderData?.vehicleType || null,
          parkingSlotName: activeOrderData?.parkingDetails?.name || null,
          parkingSlotAddress: activeOrderData?.parkingDetails?.address || null,
        };

        dispatch(setOrderAction(activeOrderDetails));
      } else {
        localStorage.removeItem("token");
        dispatch(resetUserAction());
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn("Unauthorized - logging out");
      } else {
        console.error("Auth verification failed:", error);
      }
      localStorage.removeItem("token");
      dispatch(resetUserAction());
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    dispatch(resetUserAction());
  }, [dispatch]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const contextValue = useMemo(
    () => ({ loading, checkAuth, logout }),
    [loading, checkAuth, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};
