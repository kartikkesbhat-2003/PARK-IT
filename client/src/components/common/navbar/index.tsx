import { Button } from "@/components/ui/button";
import { Wrapper } from "../wrapper";
import { Link, useLocation, useNavigate } from "react-router"; // Fixed import from react-router to react-router-dom
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux-hooks";
import UserAvatar from "@/pages/parking/_components/user.avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { envConfig } from "@/config/env.config";
import { updateUserRoleAction } from "@/redux/slices/user.slice";

const menuItems = [
  {
    name: "",
    href: "/",
  },
  {
    name: "",
    href: "/about",
  },
  {
    name: "",
    href: "/contact",
  },
  {
    name: "",
    href: "/parkings",
  },
] as const;

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isUserLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const user = useAppSelector((state) => state.user);
  const location = useLocation();
  const [show, setShow] = useState("translate-y-0 ");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  useEffect(() => {
    if (user && user.role) {
      setIsOwnerMode(user.role === "owner");
    }
  }, [user]);

  const controlNavbar = () => {
    if (window.scrollY > 0) {
      setShow("bg-gray-900/95 backdrop-blur-sm border-b border-purple-500/20");
    } else {
      setShow("translate-y-0");
    }
    setLastScrollY(window.scrollY);
  };

  const handleRoleToggle = async (checked: boolean) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${envConfig.SERVER_BASE_URL}/users/toggle-role`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: checked ? "owner" : "parker" }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setIsOwnerMode(checked);
        // Update role in Redux store
        if (data.data.user) {
          dispatch(updateUserRoleAction(data.data.user.role));
        }
        toast.success(
          data.message || `Switched to ${checked ? "owner" : "parker"} mode`
        );
      } else {
        // Revert the switch state if API call failed
        setIsOwnerMode(!checked);
        toast.error(data.message || "Failed to switch role");
      }
    } catch (error) {
      console.error("Error toggling role:", error);
      setIsOwnerMode(!checked);
      toast.error("Network error when switching role");
    } finally {
      setIsLoading(false);
    }
  };

  // Skip rendering for these pages
  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/verify-email" ||
    location.pathname === "/parking"
  )
    return null;

  return (
    <nav
      className={`w-full h-[70px] md:h-[80px] flex items-center justify-between z-20 sticky top-0 transition-all duration-300 ${show}`}
    >
      <Wrapper className={`h-[70px] flex justify-between items-center`}>
        <div className="flex flex-col items-start">
          <Link to={"/"} className="flex items-center gap-2">
            <p className="text-2xl font-bold font-gothic bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              PARK-IT
            </p>
          </Link>
        </div>
        <div className="flex items-center gap-4 sm:gap-8">
          <div className={`hidden sm:flex items-center justify-center gap-6`}>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-medium leading-6 text-gray-300 hover:text-purple-400 transition-all duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {isUserLoggedIn && (
            <div className="flex items-center gap-2 sm:gap-4">
              {user.role === "owner" && (
                <Button
                  onClick={() => {
                    navigate("/parking-owner/list-parking-spot");
                  }}
                  size={"sm"}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-200 transform hover:scale-105 active:scale-95 text-xs sm:text-sm px-2 sm:px-4"
                >
                  Dashboard
                </Button>
              )}
              <div className="flex items-center space-x-2">
                <Switch
                  id="role-toggle"
                  checked={isOwnerMode}
                  disabled={isLoading}
                  onCheckedChange={handleRoleToggle}
                  className="data-[state=checked]:bg-purple-600 scale-75 sm:scale-100"
                />
                <div className="flex flex-col">
                  <Label
                    htmlFor="role-toggle"
                    className="text-[10px] sm:text-xs text-gray-400"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="h-2 w-2 sm:h-3 sm:w-3 mr-1 animate-spin" />
                        Switching...
                      </div>
                    ) : (
                      `Mode: ${isOwnerMode ? "Owner" : "Parker"}`
                    )}
                  </Label>
                  <span className="text-[10px] sm:text-xs text-purple-400">
                    {isOwnerMode ? "Manage parkings" : "Find parkings"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {isUserLoggedIn ? (
            <UserAvatar />
          ) : (
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-200 transform hover:scale-105 active:scale-95 text-xs sm:text-sm px-2 sm:px-4">
              <Link
                to="/login"
                className="text-sm font-medium leading-6 transition-all duration-300"
              >
                Login
              </Link>
            </Button>
          )}
        </div>
      </Wrapper>
    </nav>
  );
};

export default Navbar;
