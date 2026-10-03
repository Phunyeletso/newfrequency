import { Link } from "react-router-dom";
import { APP, COMPANY } from "../lib/config";
import logo from "../assets/newFrequencyTransparentLogo.png";
import { useAccountSession } from "../lib/useAccountSession";

const LINKS = [
  ["Product", "/"],
  ["Creators", "/creators"],
  ["Business", "/business"],
  ["SOS", "/sos"],
  ["Get the app", "/get-the-app"],
  ["Feedback", "/feedback"],
  ["Contact", "/contact"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["Account", "/delete-account"],
  ["Child safety", "/child-safety"],
];

export default function Footer() {
  const { session } = useAccountSession();
  return (
    <footer className="site-footer">
      <div className="page-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="wordmark" aria-label="newFrequency home">
              <img src={logo} alt="" width="30" height="30" loading="lazy" />
              <span>new<b>Frequency</b></span>
            </Link>
            <p>Social media that pays attention.</p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            {LINKS.map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}
            <Link to={session ? "/business/missions" : "/account"}>{session ? "Workspace" : "Log in"}</Link>
          </nav>
        </div>
        <div className="footer-legal">
          <span>© {new Date().getFullYear()} {COMPANY.legalName} · South Africa</span>
        </div>
      </div>
      <span className="sr-only">{APP.name}</span>
    </footer>
  );
}
