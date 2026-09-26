import { Link } from "react-router-dom";
import ScrollReveal from "../components/ScrollReveal";
import useDocumentTitle from "../lib/useDocumentTitle";

const CAMPAIGN_STEPS = [
  ["01", "Brief", "Shape the idea and the creator task."],
  ["02", "Review", "Keep submissions together and make decisions."],
  ["03", "Fund", "Secure campaign funding before anything goes live."],
];

export default function BusinessPortal() {
  useDocumentTitle("For business", "Explore newFrequency Missions. Save a private campaign draft while verification, terms and funding are being prepared.");

  return (
    <>
      <section className="story-hero business-hero">
        <div className="page-container business-intro-grid">
          <div>
            <p className="eyebrow"><span className="signal-dot" /> newFrequency Business</p>
            <h1 className="display-title">Give creators<br />a brief worth<br /><em>making.</em></h1>
            <p className="lead-copy">Missions are being built for campaigns that start with a clear idea and leave room for creators to make it their own.</p>
            <div className="button-row">
              <Link className="button-primary" to="/business/create">Build a private draft <span className="button-arrow" aria-hidden="true">↗</span></Link>
              <Link className="button-secondary" to="/business/missions">Open workspace</Link>
            </div>
          </div>
          <ScrollReveal>
            <ol className="campaign-sequence" aria-label="Campaign lifecycle">
              {CAMPAIGN_STEPS.map(([n, title, description], index) => (
                <li key={n}>
                  <b>{n}</b><strong>{title}</strong><span>{index === 2 ? "Not enabled" : description}</span>
                </li>
              ))}
            </ol>
          </ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <ScrollReveal>
            <p className="section-kicker">A real workspace, in stages</p>
            <h2 className="section-title">Start with the brief.</h2>
            <p className="section-lead">Sign in with your newFrequency account to save a private Mission draft and come back to it later. Drafts are stored with the app’s existing account and Mission data.</p>
          </ScrollReveal>
          <div className="story-rail" style={{ marginTop: 40 }}>
            <article><span>01</span><h3>Use one account</h3><p>The Business workspace shares newFrequency sign-in. It does not create a second identity.</p></article>
            <article><span>02</span><h3>Keep the draft private</h3><p>Only the owning account can read its draft through the app’s current authorization rules.</p></article>
            <article><span>03</span><h3>Wait for the funding path</h3><p>Business verification, final campaign terms, payment checkout and launch approval are not enabled yet.</p></article>
          </div>
          <p className="rights-note" style={{ marginTop: 24 }}>Saving a draft does not submit a campaign, charge a payment method, publish a Mission or promise creator earnings. The website will show the real Mission state from the app database.</p>
        </div>
      </section>

      <section className="closing-section">
        <div className="page-container"><div className="closing-panel">
          <p className="section-kicker">Campaign work starts here</p>
          <h2>Keep the idea moving.</h2>
          <p>Create a private draft now, or contact the team if you need to discuss a campaign before the full Mission flow opens.</p>
          <div className="button-row"><Link className="button-primary" to="/business/create">Open Business workspace</Link><Link className="button-secondary" to="/contact">Contact the team</Link></div>
        </div></div>
      </section>
    </>
  );
}
