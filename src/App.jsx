import React, { useState } from 'react';
import StudyMode from "./components/StudyMode";
import LandingPage from "./components/LandingPage";
import "./App.css";

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <div className="app">
      {!hasStarted ? (
        <LandingPage onStart={() => setHasStarted(true)} />
      ) : (
        <StudyMode name={"Guest"} onExit={() => setHasStarted(false)} />
      )}
    </div>
  );
}
