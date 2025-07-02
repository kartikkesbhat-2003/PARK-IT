import React, { useState, useEffect } from "react";
import { Search, Filter, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import UserAvatar from "../user.avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { envConfig } from "@/config/env.config";
import { useAppSelector, useAppDispatch } from "@/hooks/redux-hooks";
import { updateUserRoleAction } from "@/redux/slices/user.slice";

interface IHeaderProps {
  onSearch: (searchTerm: string) => void;
}

const Header: React.FC<IHeaderProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");
  const user = useAppSelector((state) => state.user);
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  // State to track if user is in owner mode
  const [isOwnerMode, setIsOwnerMode] = useState(false);

  // Initialize owner mode from redux state when component mounts
  useEffect(() => {
    if (user && user.role) {
      setIsOwnerMode(user.role === "owner");
    }
  }, [user]);

  // Function to toggle user role
  const handleRoleToggle = async (checked: boolean) => {
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

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <p
            onClick={() => navigate("/")}
            className="text-2xl font-bold font-gothic bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent cursor-pointer"
          >
            PARK-IT
          </p>
        </div>

        <div className="relative hidden md:block w-96">
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Search parking slots..."
              autoComplete="off"
              name="search"
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-800/50 border border-purple-500/30 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onSearch(e.target.value);
              }}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </form>
        </div>

        <div className="flex items-center gap-3">
          <button className="md:hidden bg-gray-800/50 p-2 rounded-full border border-purple-500/30">
            <Search size={20} className="text-gray-300" />
          </button>
          <button
            className="md:hidden bg-gray-800/50 p-2 rounded-full border border-purple-500/30"
            // onClick={onToggleFilters}
          >
            <Filter size={20} className="text-gray-300" />
          </button>

          {isLoggedIn && user && (
            <div className="hidden md:flex items-center mr-4 pr-4 border-r border-purple-500/20 w-[200px]">
              <div className="flex items-center space-x-2">
                <Switch
                  id="role-toggle"
                  checked={isOwnerMode}
                  disabled={isLoading}
                  onCheckedChange={handleRoleToggle}
                  className="data-[state=checked]:bg-purple-600"
                />
                <div className="flex flex-col">
                  <Label
                    htmlFor="role-toggle"
                    className="text-xs text-gray-400"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Switching...
                      </div>
                    ) : (
                      `Mode: ${isOwnerMode ? "Owner" : "Parker"}`
                    )}
                  </Label>
                  <span className="text-xs text-purple-400">
                    {isOwnerMode ? "Manage parkings" : "Find parkings"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {!token ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  navigate("/login");
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <span>Login</span>
              </Button>
            </div>
          ) : (
            <UserAvatar />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
