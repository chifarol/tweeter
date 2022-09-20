import { createRoot } from "react-dom/client";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./app";
import { UserContextProvider } from "./components/contexts/usercontext";
import { AlertContextProvider } from "./components/contexts/alert";
import { TimelineContextProvider } from "./components/contexts/timeline-context";
import { CacheContextProvider } from "./components/contexts/cache";

const container = document.querySelector("#app");

const root = createRoot(container);

root.render(
  <BrowserRouter>
    <UserContextProvider>
      <TimelineContextProvider>
        <AlertContextProvider>
          <CacheContextProvider>
            <App />
          </CacheContextProvider>
        </AlertContextProvider>
      </TimelineContextProvider>
    </UserContextProvider>
  </BrowserRouter>
);
