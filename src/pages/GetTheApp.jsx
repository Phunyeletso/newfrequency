import { Link } from "react-router-dom";
import InviteForm from "../components/InviteForm";
import useDocumentTitle from "../lib/useDocumentTitle";
import { APP, DOWNLOAD } from "../lib/config";

export default function GetTheApp() {
  useDocumentTitle("Get the app", "Choose Android on Google Play or request an iOS invite for newFrequency.");

  return (
    <section className="download-hero">
      <div className="page-container download-launch">
        <p className="eyebrow"><span className="signal-dot" /> newFrequency</p>
        <h1 className="display-title">Get the<br /><em>app.</em></h1>
        <div className="download-grid" aria-label="Choose your device">
          <article className="download-option">
            <span className="platform-mark" aria-hidden="true">A</span>
            <h2>Android</h2>
            <p>Download newFrequency from Google Play.</p>
            <a className="button-primary" href={APP.googlePlayUrl} target="_blank" rel="noopener noreferrer">
              Google Play <span className="button-arrow" aria-hidden="true">↗</span>
            </a>
          </article>
          <article className="download-option">
            <span className="platform-mark" aria-hidden="true">iOS</span>
            <h2>iPhone and iPad</h2>
            <p>Leave your email to request an iOS invite.</p>
            {DOWNLOAD.iosTestFlightLive && DOWNLOAD.iosTestFlightUrl && (
              <a className="button-secondary ios-direct-link" href={DOWNLOAD.iosTestFlightUrl} target="_blank" rel="noopener noreferrer">
                Open TestFlight <span className="button-arrow" aria-hidden="true">↗</span>
              </a>
            )}
            <InviteForm platform="ios" />
          </article>
        </div>
        <p className="download-feedback"><Link className="text-link" to="/feedback">Already using newFrequency? Send feedback →</Link></p>
      </div>
    </section>
  );
}
