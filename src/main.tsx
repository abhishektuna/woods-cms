import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AppProviders } from "./app/providers";
import { router } from "./routes/router";
import { store } from "./app/store";
import { fetchMe } from "./features/auth/auth.slice";

import "./lib/axios.interceptor";
import "./index.css";

// hydrate auth state from server (keeps user logged in across reloads)
store.dispatch(fetchMe());

// restore session if possible
store.dispatch(fetchMe());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </AppProviders>
  </React.StrictMode>
);
