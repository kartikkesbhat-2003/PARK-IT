import { ChevronDownIcon, LogOutIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { useCallback } from "react";
import { resetUserAction } from "@/redux/slices/user.slice";
import { useNavigate } from "react-router";

export default function UserAvatar() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");

    dispatch(resetUserAction());
    navigate("/login");
  }, [dispatch, navigate]);

  if (!token) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage
              src={
                userData?.avatarImage ||
                "https://cdn2.iconfinder.com/data/icons/people-round-icons/128/man_avatar-512.png"
              }
              alt="Profile image"
            />
            <AvatarFallback>
              {userData?.name?.charAt(0).toUpperCase() ||
                userData?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {userData?.name || "John Doe"}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {userData?.email || "jdoe@originui.com"}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            handleLogout();
          }}
        >
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
