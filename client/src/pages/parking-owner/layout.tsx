import Sidebar from "@/components/sidebar";
import { useAppSelector } from "@/hooks/redux-hooks";
import { Navigate, Outlet } from "react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ParkingOwnerDashboardLayout = () => {
  const userRole = useAppSelector((state) => state.user.role);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!userRole || userRole === "parker") {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-full flex flex-col md:flex-row mx-auto bg-gray-900 min-h-screen">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-gray-800/50 border border-purple-500/20 hover:bg-gray-700/50"
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5 text-gray-300" />
          ) : (
            <Menu className="h-5 w-5 text-gray-300" />
          )}
        </Button>
      </div>

      {/* Sidebar - Hidden on mobile by default */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } bg-gray-800/50 border-r border-purple-500/20`}
      >
        <div className="h-full overflow-y-auto">
          <Sidebar />
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 w-full md:w-4/5 min-h-screen overflow-auto hide-scrollbar bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ParkingOwnerDashboardLayout;
