import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { curve, heroBackground, robot } from "../assets";
import Button from "./Button";
import Section from "./Section";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import { heroIcons } from "../constants";
import { ScrollParallax } from "react-just-parallax";
import { useRef } from "react";
import Generating from "./Generating";
import Notification from "./Notification";
import CompanyLogos from "./CompanyLogos";

// Supabase client setup
const SUPABASE_URL = "https://your-supabase-url.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const Hero = () => {
  const parallaxRef = useRef(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [welcomeMessage, setWelcomeMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from("users").insert([
        { name: formData.name, email: formData.email, password: formData.password },
      ]);
      if (error) {
        console.error("Error inserting data:", error.message);
        alert("There was an error saving your data.");
      } else {
        setWelcomeMessage(`Welcome, ${formData.name}!`);
        setFormVisible(false);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Unexpected error occurred.");
    }
  };

  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div className="container relative" ref={parallaxRef}>
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className="h1 mb-6">
            Empowering Artists, Redefining Music&nbsp;Ownership &nbsp;with {` `}
            <span className="inline-block relative">
              newFrequency{" "}
              <img
                src={curve}
                className="absolute top-full left-0 w-full xl:-mt-2"
                width={624}
                height={28}
                alt="Curve"
              />
            </span>
          </h1>
          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
            Owning a Music NFT unlocks the power of true ownership in the digital realm. It’s your key to creativity and exclusivity, allowing you to use and enjoy music in ways only true digital ownership can provide.
          </p>
          {!isFormVisible && (
            <Button onClick={() => setFormVisible(true)} white>
              Get started
            </Button>
          )}
        </div>

        {isFormVisible && (
          <div className="relative z-1 max-w-md mx-auto bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}

        {welcomeMessage && (
          <div className="relative z-1 max-w-md mx-auto mt-6 text-center">
            <p className="text-lg font-semibold text-green-500">{welcomeMessage}</p>
          </div>
        )}

        <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
          {/* Rest of your component remains unchanged */}
        </div>

        <CompanyLogos className="hidden relative z-10 mt-20 lg:block" />
      </div>

      <BottomLine />
    </Section>
  );
};

export default Hero;


