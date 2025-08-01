import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import './dark-theme.css';

createRoot(document.getElementById("root")).render(

    <BrowserRouter>
      <App />
    </BrowserRouter>
);
