import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import appRouter from "./router";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { APIProvider } from "@vis.gl/react-google-maps";
import { envConfig } from "./config/env.config";
import { AuthProvider } from "./context/user.loggedin";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <Provider store={store}>
      <AuthProvider>
        <APIProvider apiKey={envConfig.VITE_MAP_API_KEY}>
          <RouterProvider router={appRouter} />
          <Toaster richColors />
        </APIProvider>
      </AuthProvider>
    </Provider>
  );
}
