import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";

import AboutPage from "./pages/AboutPage";
import DiagnosisPage from "./pages/DiagnosisPage";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route path="/about" element={<AboutPage />} />
          <Route path="/diagnosis" element={<DiagnosisPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
