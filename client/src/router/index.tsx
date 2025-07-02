import { loginFormAction } from "@/pages/authentication/login/action";
import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import { loaderFunction } from "@/pages/parking/loader.function";
import loaderFunctionForEmailVerificationPage from "@/pages/authentication/email-verification/loader";
import { CommonErrorBoundary } from "@/components/common";

const appRouter = createBrowserRouter([
  {
    Component: lazy(() => import("../pages/layout")),
    errorElement: <CommonErrorBoundary />,
    // loader: layoutLoader,
    children: [
      {
        path: "/",
        Component: lazy(() => import("../pages/home")),
      },
      {
        Component: lazy(() => import("../pages/authentication/layout")),
        children: [
          {
            path: "login",
            Component: lazy(() => import("../pages/authentication/login")),
            action: loginFormAction,
          },
          {
            path: "register",
            Component: lazy(() => import("../pages/authentication/register")),
          },
          {
            path: "verify-email",
            Component: lazy(
              () => import("../pages/authentication/email-verification")
            ),
            loader: loaderFunctionForEmailVerificationPage,
          },
          {
            path: "verify-user",
            Component: lazy(
              () => import("../pages/authentication/verify-user")
            ),
          },
        ],
      },
      {
        path: "parking",
        Component: lazy(() => import("../pages/parking")),
        loader: loaderFunction,
      },
      {
        path: "parking/:id",
        Component: lazy(() => import("../pages/parking.detail")),
      },
      {
        path: "checkout",
        Component: lazy(() => import("../pages/payment")),
      },
      {
        Component: lazy(() => import("../pages/parking-owner/layout")),
        children: [
          {
            path: "parking-owner/list-parking-spot",
            Component: lazy(
              () => import("../pages/parking-owner/list-parking-spot")
            ),
          },
          {
            path: "parking-owner/active-orders",
            Component: lazy(
              () => import("../pages/parking-owner/active-orders")
            ),
          },
          {
            path: "parking-owner/listings",
            Component: lazy(
              () => import("../pages/parking-owner/listed-spots")
            ),
          },
        ],
      },
    ],
  },
]);

export default appRouter;
