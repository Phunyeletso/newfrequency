import React from "react";
import { Routes, Route } from "react-router-dom";
import AffiliateSignUp from "./components/AffiliateSignUp";
import Testers from "./components/testers";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Roadmap from "./components/Roadmap";
import Services from "./components/Services";
import Chatbot from "./components/Chatbot";

const App = () => {
  return (
    <Routes>
      {/* Default route for the website homepage */}
      <Route
        path="/"
        element={
          <>
            <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
              <Header />
              <Hero />
              <Benefits />
              <Collaboration />
              <Services />
              <Pricing />
              <Roadmap />
              <Footer />
            </div>
            <ButtonGradient />
            <Chatbot />
          </>
        }
      />
      {/* Route for the affiliate sign-up page */}
      <Route path="/affiliate" element={<AffiliateSignUp />} />
      <Route path="/testers" element={<Testers />} />
    </Routes>
  );
};

export default App;
