import { Link } from "react-router-dom";
import FrequencyPhone from "../components/FrequencyPhone";
import AppScrollStory from "../components/AppScrollStory";
import ScrollReveal from "../components/ScrollReveal";
import useDocumentTitle from "../lib/useDocumentTitle";

export default function Home() {
  useDocumentTitle(null, "Social media that pays attention. Reels, Tunes, Snaps and Chats on newFrequency.");

  return (
    <>
      <section className="hero">
        <div className="page-container-wide hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span className="signal-dot" /> Reels · Tunes · Snaps · Chats</p>
            <h1 className="display-title">Social media<br />that <em>pays attention.</em></h1>
            <p className="lead-copy">Real talent, from the people who made it.</p>
            <div className="button-row">
              <Link className="button-primary" to="/get-the-app">Get the app <span className="button-arrow" aria-hidden="true">↗</span></Link>
              <Link className="button-secondary" to="/creators">For creators</Link>
            </div>
            <div className="hero-meta"><span>South Africa</span><i /> <span>In testing</span><i /> <span>Four ways to post</span></div>
          </div>
          <FrequencyPhone />
        </div>
      </section>

      <AppScrollStory />

      <section className="section">
        <div className="page-container">
          <ScrollReveal>
            <div className="support-band">
              <div>
                <p className="section-kicker">Creator support</p>
                <h2>Creator support.</h2>
                <p>Coin gifts and eligible paid views use Frequency Coins where enabled.</p>
              </div>
              <div>
                <div className="support-list" aria-label="Support features">
                  <div><strong>Coin gifts</strong><span>Support a creator’s work</span></div>
                  <div><strong>Eligible paid views</strong><span>Eligibility applies</span></div>
                </div>
                <Link className="text-link" to="/creators">For creators <span aria-hidden="true">→</span></Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section warm-section">
        <div className="page-container story-grid">
          <div>
            <p className="section-kicker">Business workspace</p>
            <h2 className="section-title">Create Mission.</h2>
            <p className="section-lead">Draft a private Mission brief. Public funding and launch remain gated.</p>
            <div className="button-row"><Link className="button-primary" to="/business">Explore Business <span className="button-arrow" aria-hidden="true">↗</span></Link></div>
          </div>
          <div className="story-visual" aria-hidden="true">
            <div className="story-visual-orbit" />
            <div className="story-statement">
              <span className="story-statement-mark">✳</span>
              <span className="network-node-kicker">PRIVATE DRAFT</span>
              <h2>Create<br />Mission.</h2>
              <p>Business workspace</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section rollout-section" aria-labelledby="rollout-title">
        <div className="page-container">
          <ScrollReveal>
            <div className="section-topline">
              <div>
                <p className="section-kicker">Release status</p>
                <h2 className="section-title" id="rollout-title">More is in testing.</h2>
              </div>
              <p className="section-lead">Availability depends on release checks.</p>
            </div>
          </ScrollReveal>
          <div className="rollout-rail">
            <article><span className="rollout-status">LIVE · PRE-RELEASE</span><h3>Live streaming</h3><p>Provider and device checks remain.</p></article>
            <article><span className="rollout-status">MARKETPLACE · REVIEW</span><h3>Marketplace</h3><p>Legal and operations review remain.</p></article>
            <article><span className="rollout-status">FREQUENCY SOS · STAGING</span><h3>Frequency SOS</h3><p>Staging and device checks remain.</p></article>
          </div>
        </div>
      </section>

      <section className="closing-section">
        <div className="page-container">
          <ScrollReveal>
            <div className="closing-panel">
              <p className="section-kicker">newFrequency</p>
              <h2>Social media that pays attention.</h2>
              <p>Now in testing.</p>
              <div className="button-row">
                <Link className="button-primary" to="/get-the-app">Check app access <span className="button-arrow" aria-hidden="true">↗</span></Link>
                <Link className="button-secondary" to="/feedback">Send feedback</Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
