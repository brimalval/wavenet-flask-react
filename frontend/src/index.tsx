import React from "react";
import ReactDOM from "react-dom/client";
import "./utils/global.css";
import App from "./App";

const container = document.getElementById("root");
if (container === null) {
    throw new Error("The root element was not found!");
}
const root = ReactDOM.createRoot(container);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
