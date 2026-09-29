import { Link } from "react-router-dom";
import ScrollReveal from "../components/ScrollReveal";
import useDocumentTitle from "../lib/useDocumentTitle";

const CAMPAIGN_STEPS = [
  ["01", "Brief", "Shape the idea and the creator task."],
  ["02", "Review", "Keep submissions together and make decisions."],
  ["03", "Fund", "Secure campaign funding before anything goes live."],
];

export default function BusinessPortal() {
  useDocumentTitle("For business", "Create a newFrequency Mission, submit campaign details for review and use Paystack checkout after business verification.");

  return (
    <>
      <section className="story-hero business-hero">
        <div className="page-container business-intro-grid">
          <div>
            <p className="eyebrow"><span className="signal-dot" /> newFrequency Business</p>
            <h1 className="display-title">Give creators<br />a brief worth<br /><em>making.</em></h1>
            <p className="lead-copy">Create a creator campaign with a clear brief, a reward pool and room for creators to make the idea their own.</p>
            <div className="button-row">
              <Link className="button-primary" to="/business/create">Create a Mission <span className="button-arrow" aria-hidden="true">↗</span></Link>
              <Link className="button-secondary" to="/business/missions">Open workspace</Link>
            </div>
          </div>
          <ScrollReveal>
            <ol className="campaign-sequence" aria-label="Campaign lifecycle">
              {CAMPAIGN_STEPS.map(([n, title, description]) => (
                <li key={n}>
                  <b>{n}</b><strong>{title}</strong><span>{description}</span>
                </li>
              ))}
            </ol>
          </ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <ScrollReveal>
            <p className="section-kicker">Business workspace</p>
            <h2 className="section-title">From brief to campaign review.</h2>
            <p className="section-lead">Sign in with your newFrequency account, complete the campaign form and submit it for business verification. After verification, the server-calculated total can be paid through Paystack. Payment does not publish a campaign.</p>
          </ScrollReveal>
          <div className="story-rail" style={{ marginTop: 40 }}>
            <article><span>01</span><h3>Use one account</h3><p>The Business workspace shares newFrequency sign-in. It does not create a second identity.</p></article>
            <article><span>02</span><h3>Keep the draft private</h3><p>Only the owning account can read its draft through the app’s current authorization rules.</p></article>
            <article><span>03</span><h3>Verify, fund and review</h3><p>Business verification gates Paystack checkout. A paid Mission still needs campaign review before it can launch.</p></article>
          </div>
          <p className="rights-note" style={{ marginTop: 24 }}>Saving a draft does not submit a campaign or charge a payment method. Paystack checkout is hosted and server-verified. A payment does not itself publish a Mission or promise creator earnings.</p>
        </div>
      </section>

      <section className="closing-section">
        <div className="page-container"><div className="closing-panel">
          <p className="section-kicker">Campaign work starts here</p>
          <h2>Keep the idea moving.</h2>
          <p>Sign in to complete the Mission form, submit business details for review and continue to checkout when verification is complete.</p>
          <div className="button-row"><Link className="button-primary" to="/business/create">Open Business workspace</Link><Link className="button-secondary" to="/contact">Contact the team</Link></div>
        </div></div>
      </section>
    </>
  );
}
