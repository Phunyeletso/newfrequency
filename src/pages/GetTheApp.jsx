import { Link } from "react-router-dom";
import InviteForm from "../components/InviteForm";
import useDocumentTitle from "../lib/useDocumentTitle";
import { APP, DOWNLOAD } from "../lib/config";
import googlePlayIcon from "../assets/platforms/googleplay.svg";
import appleIcon from "../assets/platforms/apple.svg";

export default function GetTheApp() {
  useDocumentTitle("Get the app", "Choose Android on Google Play or request an iOS invite for newFrequency.");

  return (
    <section className="download-hero">
      <div className="page-container download-launch">
        <h1 className="sr-only">Choose your device</h1>
        <div className="download-grid" aria-label="Choose your device">
          <article className="download-option">
            <span className="platform-mark" aria-hidden="true"><img src={googlePlayIcon} alt="" width="24" height="24" /></span>
            <h2>Android</h2>
            <p>Download newFrequency from Google Play.</p>
            <a className="button-primary" href={APP.googlePlayUrl} target="_blank" rel="noopener noreferrer">
              Google Play <span className="button-arrow" aria-hidden="true">↗</span>
            </a>
          </article>
          <article className="download-option">
            <span className="platform-mark" aria-hidden="true"><img src={appleIcon} alt="" width="24" height="24" /></span>
            <h2>IOS</h2>
            <p>Leave your email to request an iOS invite.</p>
            {DOWNLOAD.iosTestFlightLive && DOWNLOAD.iosTestFlightUrl && (
              <a className="button-secondary ios-direct-link" href={DOWNLOAD.iosTestFlightUrl} target="_blank" rel="noopener noreferrer">
                Open TestFlight <span className="button-arrow" aria-hidden="true">↗</span>
              </a>
            )}
            <InviteForm platform="ios" />
          </article>
        </div>
        <div className="download-feedback"><p>Already using newFrequency?</p><Link className="text-link" to="/feedback">Send feedback →</Link></div>
      </div>
    </section>
  );
}
