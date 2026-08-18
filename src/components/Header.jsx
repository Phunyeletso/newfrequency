import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import logo from "../assets/newFrequencyTransparentLogo.png";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/for-artists", label: "For artists" },
  { to: "/get-the-app", label: "Get the app" },
  { to: "/feedback", label: "Feedback" },
  { to: "/contact", label: "Contact" },
];

function navClass({ isActive }) {
  return [
    "block rounded-md px-3 py-3 text-base transition-colors sm:py-2 sm:text-sm",
    isActive ? "text-accent font-medium" : "text-muted hover:text-ink",
  ].join(" ");
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ground/95 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2.5 rounded-md">
          <img
            src={logo}
            alt=""
            width="32"
            height="32"
            className="h-8 w-8"
            decoding="async"
          />
          <span className="text-lg font-semibold tracking-tight">
            new<span className="text-accent">Frequency</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden sm:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={navClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="-mr-2 rounded-md p-2 text-muted hover:text-ink sm:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-line sm:hidden">
          <ul className="mx-auto max-w-content px-3 py-2">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={navClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
