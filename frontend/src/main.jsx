import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";

function Main() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // cleanup on unmount
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PulseLoader color="#123abc" loading={true} size={10} />
      </div>
    );
  }

  return (
    <Router>
      <App />
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
