import Navbar from "@/components/common/navbar";
import { Loader2 } from "lucide-react";
import React from "react";
import { Await, Outlet, useLoaderData } from "react-router";

const RootLayout = () => {
  const loaderData = useLoaderData() as {
    userLocation: string;
  };
  return (
    <React.Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center">
          <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
        </div>
      }
    >
      <Await resolve={loaderData}>
        {(value) => {
          return (
            <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col">
              <Navbar />
              <Outlet />
            </div>
          );
        }}
      </Await>
    </React.Suspense>
  );
};

export default RootLayout;
