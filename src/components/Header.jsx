import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { useState } from "react";

import newFrequencyLogo from "../assets/newFrequencyLogo.png";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dpreldjtbgpkaxivsyxi.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmVsZGp0Ymdwa2F4aXZzeXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5OTc0NjAsImV4cCI6MjA0NzU3MzQ2MH0.vDlIQwUOxeVoUkdQPlD8uOhAmRzJDodJrNy3fvXVVVY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const Header = () => {
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [isFormVisible, setFormVisible] = useState(false); // State to toggle pop-up form
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

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
          `Boom! Welcome, ${name}! 🎉 You’ve been invited to our closed app testing. The app will be public on 1 January 2025. Stay tuned!`
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
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50  border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
          }`}
      >
        <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
          <a
            className="block text-white text-xl italic font-semibold xl:mr-8"
            href="#hero"
          >
            newFrequency
          </a>

          <nav
            className={`${openNavigation ? "flex" : "hidden"
              } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
          >
            <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  onClick={handleClick}
                  className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${item.onlyMobile ? "lg:hidden" : ""
                    } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${item.url === pathname.hash ? "z-2 lg:text-n-1" : "lg:text-n-1/50"
                    } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
                >
                  {item.title}
                </a>
              ))}
              {/* Add Sign-Up Button in the Hamburger Menu */}
              <Button
                className="lg:hidden mt-4 px-6 py-3 text-white"
                onClick={() => {
                  setFormVisible(true);
                  toggleNavigation(); // Close the menu when clicked
                }}
              >
                Sign Up
              </Button>
            </div>
          </nav>


          {/* Desktop Sign-Up Button */}
          <Button
            className="hidden lg:flex ml-4"
            onClick={() => setFormVisible(true)}
          >
            Sign Up
          </Button>

          <Button
            className="ml-auto lg:hidden"
            px="px-3"
            onClick={toggleNavigation}
          >
            <MenuSvg openNavigation={openNavigation} />
          </Button>
        </div>
      </div>

      {/* Sign-Up Form Pop-Up */}
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
                <h2 className="text-2xl font-bold text-green-400 mb-4">Boom!</h2>
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
    </>
  );
};

export default Header;


