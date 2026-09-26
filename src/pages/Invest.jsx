import { Link } from "react-router-dom";
import ScrollReveal from "../components/ScrollReveal";
import useDocumentTitle from "../lib/useDocumentTitle";
import { INVESTMENTS_ENABLED } from "../lib/config";

const RISKS = [
  ["Early product", "newFrequency is in testing. The product, business model and release plan may change."],
  ["Adoption", "There is no promise that creators, viewers or brands will adopt the platform at a sustainable rate."],
  ["Execution", "Building safe media, reliable payments and useful creator tools takes time and may cost more than planned."],
  ["Rules and providers", "App-store, privacy, payment and financial rules can change. Provider access can also be restricted."],
];

export default function Invest() {
  useDocumentTitle("Invest in newFrequency", "Learn what newFrequency is building. No investment offering is currently open.");

  return (
    <>
      <section className="story-hero invest-hero">
        <div className="page-container">
          <p className="eyebrow"><span className="signal-dot" /> The company we are building</p>
          <h1 className="display-title">A new home<br />for creator<br /><em>culture.</em></h1>
          <p className="lead-copy">newFrequency brings short video, photos, conversation and music into one creator-social app. We are building it from South Africa, with creators at the centre.</p>
          <div className="button-row"><Link className="button-primary" to="/company">About the company <span className="button-arrow" aria-hidden="true">↗</span></Link></div>
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <ScrollReveal>
            <div className="invest-statement">
              <p className="section-kicker">Where we are</p>
              <h2>Product in testing. Offering not open.</h2>
              <p>This page introduces the product and the company’s direction. It is not an invitation to invest or contribute. No investment account, instrument, price, valuation or return has been approved for this website.</p>
              <p>We will publish the issuer details, legal documents, fees, risks and any offering terms before any future offering can be considered.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section music-section">
        <div className="page-container story-grid">
          <div>
            <p className="section-kicker">The starting point</p>
            <h2 className="section-title">Creators should not have to split every idea across a dozen places.</h2>
          </div>
          <p className="section-lead">Our product brings four post formats—Reels, Snaps, Chat and Tunes—into a shared social feed. The opportunity is an idea we are testing, not a measured market claim or a promise of growth.</p>
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <ScrollReveal>
            <p className="section-kicker">What exists today</p>
            <h2 className="section-title">Build status, stated plainly.</h2>
          </ScrollReveal>
          <div className="story-rail" style={{ marginTop: 40 }}>
            <article><span>CORE</span><h3>Post and discover</h3><p>The app has creator profiles, a feed, and Reels, Snaps, Chat and Tune formats.</p></article>
            <article><span>TESTING</span><h3>Creator support</h3><p>Coin gifts and eligible paid-scroll flows are under release testing. Earnings and payouts are not guaranteed.</p></article>
            <article><span>IN PROGRESS</span><h3>Business campaigns</h3><p>Private Mission drafts can be saved when the shared account connection is configured. Funding and launch are closed.</p></article>
          </div>
          <p className="fine-print" style={{ marginTop: 18 }}>There are no published user, revenue, retention, partnership or growth figures on this page.</p>
        </div>
      </section>

      <section className="section warm-section">
        <div className="page-container story-grid">
          <div><p className="section-kicker">A future capital plan</p><h2 className="section-title">No budget has been approved.</h2></div>
          <div>
            <p className="section-lead">If the company opens an offering, its documents will state exactly what capital is intended to fund. Product reliability and safety, creator tools, and Business/Mission infrastructure are current areas of work—not approved allocations.</p>
            <p className="section-lead">No dates, amounts or valuation are being offered here.</p>
          </div>
        </div>
      </section>

      <section className="section roadmap-section">
        <div className="page-container">
          <p className="section-kicker">What comes next</p>
          <h2 className="section-title">A roadmap of checkpoints, not promises.</h2>
          <p className="section-lead">These are areas that need to be resolved before broader access or any offering. There are no target dates attached.</p>
          <div className="story-rail" style={{ marginTop: 34 }}>
            <article><span>01 · RELEASE</span><h3>Prove the install path</h3><p>Validate current builds, account setup and core use on supported devices before widening access.</p></article>
            <article><span>02 · CREATOR SUPPORT</span><h3>Complete the money flows</h3><p>Finish provider, eligibility, transaction and payout checks before describing creator earnings as available.</p></article>
            <article><span>03 · MISSIONS</span><h3>Close the campaign gaps</h3><p>Complete business verification, funding, campaign terms and operational review before a Mission can launch.</p></article>
            <article><span>04 · COMPANY</span><h3>Establish offering readiness</h3><p>Approve the legal structure, risk disclosures, verification and audited payment records before publishing investment documents.</p></article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <p className="section-kicker">Risks to understand</p>
          <h2 className="section-title">Early-stage work carries real risk.</h2>
          <div className="risk-grid" style={{ marginTop: 35 }}>
            {RISKS.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}
          </div>
          <div className="closed-state" style={{ marginBottom: 0 }}>
            <p className="section-kicker">No offering is open</p>
            <h2>There is nothing to buy or contribute here.</h2>
            <p>No payment will create shares or investor rights. Any future offering would need an approved legal structure, a verified payment and ledger system, and complete documents first.</p>
            <Link className="button-secondary" to="/invest/dashboard">Investor access</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export function InvestDashboard() {
  useDocumentTitle("Investor access", "No investment account or offering is currently available.");
  return (
    <section className="section">
      <div className="page-container">
        <div className="closed-state">
          <p className="section-kicker">Investor access</p>
          <h1>{INVESTMENTS_ENABLED ? "Account access is still closed." : "No offering is open."}</h1>
          <p>{INVESTMENTS_ENABLED
            ? "The website switch alone cannot accept funds. An approved offering, investor verification, server-verified payments and an auditable ledger are not configured for this release."
            : "There is no investor account, payment flow or investment ledger on this release. Signing in or paying through this site cannot create an investment, shares or any other ownership right."}</p>
          <Link className="button-secondary" to="/invest">Read the company overview</Link>
        </div>
      </div>
    </section>
  );
}
