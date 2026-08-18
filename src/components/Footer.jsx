import { Link } from "react-router-dom";
import { APP, COMPANY } from "../lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-line px-5 py-10 text-sm text-faint">
      <div className="mx-auto max-w-content text-center">
        <nav aria-label="Footer">
          <ul className="mb-6 flex flex-wrap justify-center gap-x-5 gap-y-2">
            <li><Link to="/for-artists" className="link-underline">For artists</Link></li>
            <li><Link to="/get-the-app" className="link-underline">Get the app</Link></li>
            <li><Link to="/feedback" className="link-underline">Feedback</Link></li>
            <li><Link to="/contact" className="link-underline">Contact</Link></li>
            <li><Link to="/privacy" className="link-underline">Privacy</Link></li>
            <li><Link to="/terms" className="link-underline">Terms</Link></li>
          </ul>
        </nav>

        <p className="mb-1">
          Version {APP.version} · South Africa
        </p>
        <p className="mx-auto max-w-prose">
          © {new Date().getFullYear()} {COMPANY.legalName}. We handle personal
          information under POPIA — see our{" "}
          <Link to="/privacy" className="link-underline">privacy policy</Link>.
        </p>
      </div>
    </footer>
  );
}
