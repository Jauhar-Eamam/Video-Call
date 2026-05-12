import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import { Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication";
import { AuthProvider } from "./contexts/AuthContext";
import VideoMeetComponent from "./pages/VideoMeet";
import History from "./pages/History";
import "./App.css";

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/:url" element={<VideoMeetComponent />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
