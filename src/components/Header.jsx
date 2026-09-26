import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/newFrequencyTransparentLogo.png";

const NAV = [
  { to: "/", label: "Product", end: true },
  { to: "/creators", label: "Creators" },
  { to: "/for-artists", label: "Music" },
  { to: "/business", label: "Business" },
  { to: "/invest", label: "Invest" },
  { to: "/company", label: "Company" },
];

function navClass({ isActive }) {
  return isActive ? "active" : undefined;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="wordmark" aria-label="newFrequency home">
          <img src={logo} alt="" width="34" height="34" decoding="async" />
          <span>new<b>Frequency</b></span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link className="header-cta" to="/get-the-app">Get the app <span aria-hidden="true">↗</span></Link>
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open
              ? <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              : <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Main navigation">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/get-the-app" className={navClass}>Get the app</NavLink>
        </nav>
      )}
    </header>
  );
}
