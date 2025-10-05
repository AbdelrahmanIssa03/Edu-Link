import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ClassProvider } from "./contexts/ClassContext";
import { SessionProvider } from "./contexts/SessionContext";

const rootElement = document.getElementById("root") as HTMLElement;

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <ClassProvider>
            <SessionProvider>
              <App />
            </SessionProvider>
          </ClassProvider>
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
}
