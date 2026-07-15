import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Ignore harmless play() interrupted errors from ReactPlayer or Audio unmounts
window.addEventListener('unhandledrejection', event => {
  if (event.reason && event.reason.message && event.reason.message.includes('The play() request was interrupted')) {
    event.preventDefault();
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
