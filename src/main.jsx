import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { SessionContextProvider } from "./context/SessionContext";
import { UserContextProvider } from "@/context/UserContext";
import { TaskListContextProvider } from "./context/TaskListContext";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SessionContextProvider>
        <UserContextProvider>
          <TaskListContextProvider>
            <App />
          </TaskListContextProvider>
        </UserContextProvider>
      </SessionContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
