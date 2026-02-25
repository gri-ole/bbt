// Entry point for the BusyBuddy.Toys under-construction React app.
// This file assumes React & ReactDOM are loaded globally via UMD bundles,
// and that the App component is defined on the window by App.jsx.

const container = document.getElementById("root");

if (container && typeof ReactDOM !== "undefined" && typeof App !== "undefined") {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
} else {
  // Fallback: simple error message if something critical fails to load.
  console.error("BusyBuddy.Toys: React, ReactDOM, or App is not available.");
}


