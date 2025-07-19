import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { RouterProvider } from "react-router";
import { router } from "./router/router.jsx";
import AuthProvider from "./Context/AuthProver.jsx";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster
            toastOptions={{
              success: {
                duration: 5000,
                style: {
                  background: "#065482",
                  color: "#fff",
                },
              },
              error: {
                duration: 9000,
                style: {
                  background: "#f89746",
                  color: "#fff",
                },
              },
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);
