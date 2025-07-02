import { useState, ReactNode, JSX } from "react";
import { Home, Bell, LogOut, LucideIcon, List } from "lucide-react";
import { NavLink } from "react-router";

interface NavItemProps {
  icon: ReactNode;
  text: string;
  toLink: string;
}

interface SidebarProps {
  title?: string;
  defaultCollapsed?: boolean;
}

export default function Sidebar({
  title = "Dashboard",
  defaultCollapsed = false,
}: SidebarProps): JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed);

  const NavItem = ({ icon, text, toLink }: NavItemProps): JSX.Element => (
    <NavLink
      to={toLink}
      className={({ isActive }) =>
        `flex items-center p-3 my-1 cursor-pointer transition-all duration-200 rounded-lg relative group ${
          isCollapsed ? "justify-center" : "px-4"
        } ${
          isActive
            ? "bg-purple-900/50 text-purple-400 shadow-sm border border-purple-500/30"
            : "text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 border border-transparent hover:border-purple-500/20"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active indicator line */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-full transition-all duration-200 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Icon container */}
          <div
            className={`transition-all duration-200 ${
              isActive
                ? "text-purple-400 transform scale-110"
                : "text-gray-400 group-hover:text-gray-300"
            }`}
          >
            {icon}
          </div>

          {/* Text */}
          {!isCollapsed && (
            <span
              className={`ml-3 font-medium transition-all duration-200 ${
                isActive
                  ? "text-purple-400 font-semibold"
                  : "text-gray-400 group-hover:text-gray-300"
              }`}
            >
              {text}
            </span>
          )}

          {/* Subtle glow effect when active */}
          <div
            className={`absolute inset-0 rounded-lg transition-all duration-200 pointer-events-none ${
              isActive
                ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10"
                : "opacity-0"
            }`}
          />
        </>
      )}
    </NavLink>
  );

  type NavItemConfig = {
    icon: LucideIcon;
    text: string;
    path: string;
  };

  const navigationItems: NavItemConfig[] = [
    {
      icon: Home,
      text: "Home",
      path: "parking-owner/list-parking-spot",
    },
    {
      icon: Bell,
      text: "Orders",
      path: "parking-owner/active-orders",
    },
    {
      icon: List,
      text: "My Listings",
      path: "parking-owner/listings",
    },
  ];

  return (
    <div
      className={`h-[calc(100vh-70px)] border-r border-purple-500/20 bg-gray-800/50 backdrop-blur-sm transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-16" : "w-full"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
        {!isCollapsed && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {title}
          </h1>
        )}
        {/* <button
          onClick={toggleSidebar}
          className="p-1 rounded-lg hover:bg-gray-100"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button> */}
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavItem
            key={item.path}
            icon={<item.icon size={20} />}
            text={item.text}
            toLink={item.path}
          />
        ))}
      </div>

      <div className="border-t border-purple-500/20 p-4">
        <NavItem 
          icon={<LogOut size={20} />} 
          text="Logout" 
          toLink="/" 
        />
      </div>
    </div>
  );
}
