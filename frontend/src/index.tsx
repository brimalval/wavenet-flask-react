import React from "react";
import ReactDOM from "react-dom/client";
import "./utils/global.css";
import App from "./App";
import "@fontsource/roboto";
import "@fontsource/poppins";
import "@fontsource/open-sans";
import { StyledEngineProvider } from "@mui/material";

const container = document.getElementById("root");
if (container === null) {
  throw new Error("The root element was not found!");
}
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </React.StrictMode>
);
