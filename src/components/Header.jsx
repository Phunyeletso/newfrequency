import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/newFrequencyTransparentLogo.png";
import { useAccountSession } from "../lib/useAccountSession";

const NAV = [
  { to: "/", label: "Product", end: true },
  { to: "/creators", label: "Creators" },
  { to: "/business", label: "Business" },
  { to: "/sos", label: "SOS" },
];

function navClass({ isActive }) {
  return isActive ? "active" : undefined;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { session } = useAccountSession();
  const { key } = useLocation();

  useEffect(() => setOpen(false), [key]);
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

        <div className="header-actions">
          <Link className="header-account" to={session ? "/business/missions" : "/account"}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg><span>{session ? "Workspace" : "Log in"}</span></Link>
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
      </div>
      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Main navigation">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/get-the-app" className={navClass}>Get the app</NavLink>
          <NavLink to={session ? "/business/missions" : "/account"} className={navClass}>{session ? "Workspace" : "Log in"}</NavLink>
        </nav>
      )}
    </header>
  );
}
