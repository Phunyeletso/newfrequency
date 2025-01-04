import { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { curve, heroBackground, robot } from "../assets";
import Button from "./Button";
import Section from "./Section";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import { heroIcons } from "../constants";
import { ScrollParallax } from "react-just-parallax";
import Generating from "./Generating";
import Notification from "./Notification";
import CompanyLogos from "./CompanyLogos";

// Supabase client setup
const SUPABASE_URL = "https://dpreldjtbgpkaxivsyxi.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmVsZGp0Ymdwa2F4aXZzeXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5OTc0NjAsImV4cCI6MjA0NzU3MzQ2MH0.vDlIQwUOxeVoUkdQPlD8uOhAmRzJDodJrNy3fvXVVVY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const Hero = () => {
  const parallaxRef = useRef(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = formData;

    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (error) {
        setSuccessMessage(`Error: ${error.message}`);
        console.error("Sign-up error:", error);
      } else {
        setSuccessMessage(
          `Welcome, ${name}! 🎉 You’ve been invited to our closed app testing. The app will be public on 1 January 2025. Stay tuned!`
        );
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setSuccessMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
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
            Owning a Music NFT unlocks the power of true ownership in the digital realm. It’s your
            key to creativity and exclusivity, allowing you to use and enjoy music in ways only true
            digital ownership can provide.
          </p>
          {!isFormVisible && (
            <Button onClick={() => setFormVisible(true)} white>
              Get Started
            </Button>
          )}
        </div>

        {/* Form Pop-up */}
        {isFormVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="bg-[#1a1a1a] rounded-lg shadow-lg w-full max-w-md p-6 text-white">
              {!successMessage ? (
                <>
                  <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-bold mb-2 text-gray-300">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded bg-[#333] text-white border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-bold mb-2 text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded bg-[#333] text-white border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="password"
                        className="block text-sm font-bold mb-2 text-gray-300"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded bg-[#333] text-white border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setFormVisible(false)}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        {loading ? "Signing Up..." : "Sign Up"}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-green-400 mb-4">BOOM!</h2>
                  <p className="text-lg text-gray-300">{successMessage}</p>
                  <button
                    onClick={() => setFormVisible(false)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
          <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
            <div className="relative bg-n-8 rounded-[1rem]">
              <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem]" />
              <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
                <img
                  src={robot}
                  className="w-full scale-[1.7] translate-y-[8%] md:scale-[1] md:-translate-y-[10%] lg:-translate-y-[23%]"
                  width={1024}
                  height={490}
                  alt="AI"
                />
                <Generating className="absolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2" />
                <ScrollParallax isAbsolutelyPositioned>
                  <ul className="hidden absolute -left-[5.5rem] bottom-[7.5rem] px-1 py-1 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-2xl xl:flex">
                    {heroIcons.map((icon, index) => (
                      <li className="p-5" key={index}>
                        <img src={icon} width={24} height={25} alt={icon} />
                      </li>
                    ))}
                  </ul>
                </ScrollParallax>
                <ScrollParallax isAbsolutelyPositioned>
                  <Notification
                    className="hidden absolute -right-[5.5rem] bottom-[11rem] w-[18rem] xl:flex"
                    title="Code generation"
                  />
                </ScrollParallax>
              </div>
            </div>
            <Gradient />
          </div>
          <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
            <img
              src={heroBackground}
              className="w-full"
              width={1440}
              height={1800}
              alt="hero"
            />
          </div>
          <BackgroundCircles />
        </div>

        <CompanyLogos className="hidden relative z-10 mt-20 lg:block" />
      </div>
      <BottomLine />
    </Section>
  );
};

export default Hero;







