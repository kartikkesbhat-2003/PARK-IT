import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="w-full flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
