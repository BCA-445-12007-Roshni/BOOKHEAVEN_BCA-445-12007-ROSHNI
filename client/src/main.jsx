import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css"; // Tailwind CSS
import ShopContextProvider from "./context/ShopContext.jsx";

// Get the root element
const root = document.getElementById("root");

// Render React app
createRoot(root).render(
  <BrowserRouter>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </BrowserRouter>,
);
