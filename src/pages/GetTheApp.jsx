import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import InviteForm from "../components/InviteForm";
import useDocumentTitle from "../lib/useDocumentTitle";
import { DOWNLOAD } from "../lib/config";

function detectDevice() {
  if (typeof navigator === "undefined") return { platform: "desktop", inApp: false };
  const ua = navigator.userAgent || "";
  const android = /Android/i.test(ua);
  const ios = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const inApp = /Instagram|FBAN|FBAV|FB_IAB|TikTok|musical_ly|BytedanceWebview|Line\/|LinkedInApp/i.test(ua);
  return { platform: android ? "android" : ios ? "ios" : "desktop", inApp };
}

export default function GetTheApp() {
  useDocumentTitle("Get the app", "Check current newFrequency test-build availability for Android and iPhone.");
  const [searchParams] = useSearchParams();
  const [detected, setDetected] = useState({ platform: "desktop", inApp: false });
  const [android, setAndroid] = useState("checking");
  const [version, setVersion] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [copied, setCopied] = useState(false);

  const checkAndroid = useCallback(async () => {
    setRetrying(true);
    try {
      const response = await fetch(`${DOWNLOAD.androidDownloadPath}?status=1`, { cache: "no-store", headers: { Accept: "application/json" } });
      const result = await response.json();
      setAndroid(result.available ? "available" : "unavailable");
      setVersion(result.version || null);
    } catch {
      setAndroid("unavailable");
      setVersion(null);
    } finally {
      setRetrying(false);
    }
  }, []);

  useEffect(() => {
    setDetected(detectDevice());
    checkAndroid();
  }, [checkAndroid]);

  const unavailableReturn = searchParams.get("download") === "unavailable";
  const chromeIntent = typeof window !== "undefined"
    ? `intent://${window.location.host}/get-the-app#Intent;scheme=https;package=com.android.chrome;end`
    : undefined;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/get-the-app`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch { setCopied(false); }
  }

  return (
    <>
      <section className="download-hero">
        <div className="page-container">
          <p className="eyebrow"><span className="signal-dot" /> Early access</p>
          <h1 className="display-title">Get<br /><em>newFrequency.</em></h1>
          <p className="lead-copy">The app is in testing. Choose your device to see the current install path.</p>
          {detected.platform !== "desktop" && <p className="status-inline" style={{ marginTop: 17 }}><span className="signal-dot" /> Showing options for {detected.platform === "android" ? "Android" : "iPhone or iPad"}</p>}

          {detected.inApp && detected.platform === "android" && <div className="browser-note" role="status">
            Open this page in Chrome or Samsung Internet before downloading. Some Instagram, TikTok and Facebook in-app browsers do not hand Android installers to the system. <a href={chromeIntent}>Open in Chrome</a>.
          </div>}
          {unavailableReturn && <div className="browser-note" role="alert">The Android installer could not be verified. Please try again later.</div>}

          <div className="download-grid">
            <article className="download-option">
              <span className="platform-mark" aria-hidden="true">◉</span>
              <h2>Android</h2>
              {android === "checking" ? <p role="status">Checking the current installer…</p> : android === "available" ? (
                <>
                  <p>{version ? `Test build ${version} is available as a direct download.` : "A current Android test build is available as a direct download."} This is not a Play Store install.</p>
                  {detected.inApp
                    ? <a className="button-secondary" href={chromeIntent}>Open in Chrome <span className="button-arrow" aria-hidden="true">↗</span></a>
                    : <a className="button-primary" href={DOWNLOAD.androidDownloadPath}>Download for Android <span className="button-arrow" aria-hidden="true">↓</span></a>}
                  <p className="fine-print" style={{ marginTop: 12 }}>Android may ask you to allow your browser to install this test build.</p>
                  {detected.platform === "desktop" && <button type="button" className="text-link" style={{ marginTop: 12, border: 0, background: "none", padding: 0, cursor: "pointer" }} onClick={copyLink}>{copied ? "Link copied" : "Copy this page link for your phone"}</button>}
                </>
              ) : (
                <>
                  <p>The current Android installer is unavailable or could not be verified. We will show the download here when a valid test build is ready.</p>
                  <button type="button" className="button-secondary" onClick={checkAndroid} disabled={retrying}>{retrying ? "Checking…" : "Check again"}</button>
                  <Link className="text-link" style={{ marginTop: 14 }} to="/contact">Ask about test access <span aria-hidden="true">→</span></Link>
                </>
              )}
            </article>

            <article className="download-option">
              <span className="platform-mark" aria-hidden="true">⌁</span>
              <h2>iPhone and iPad</h2>
              {DOWNLOAD.iosTestFlightLive && DOWNLOAD.iosTestFlightUrl ? (
                <><p>iOS testing is available through Apple TestFlight.</p><a className="button-primary" href={DOWNLOAD.iosTestFlightUrl} target="_blank" rel="noopener noreferrer">Open TestFlight <span className="button-arrow" aria-hidden="true">↗</span></a></>
              ) : (
                <><p>iOS access is invite-only while testing continues. Leave your email to request an invitation.</p><InviteForm /></>
              )}
            </article>
          </div>
          <p className="fine-print" style={{ marginTop: 18 }}>The app is not listed on Google Play or the Apple App Store at this time.</p>
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <details className="rights-note">
            <summary style={{ cursor: "pointer", color: "var(--ink)", fontWeight: 650 }}>Android install help</summary>
            <p style={{ marginBottom: 0 }}>After download, open the APK from your browser’s download notification or Downloads folder and follow Android’s install prompt. Only continue if you intended to install the newFrequency test build.</p>
          </details>
          <div className="button-row"><Link className="text-link" to="/feedback">Already testing? Send feedback <span aria-hidden="true">→</span></Link></div>
        </div>
      </section>
    </>
  );
}
