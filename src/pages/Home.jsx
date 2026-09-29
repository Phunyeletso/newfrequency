import { Link } from "react-router-dom";
import FrequencyPhone from "../components/FrequencyPhone";
import AppScrollStory from "../components/AppScrollStory";
import ScrollReveal from "../components/ScrollReveal";
import useDocumentTitle from "../lib/useDocumentTitle";

export default function Home() {
  useDocumentTitle(null, "Post videos, pictures, music and quotes your way on newFrequency.");

  return (
    <>
      <section className="hero">
        <div className="page-container-wide hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span className="signal-dot" /> newFrequency</p>
            <h1 className="display-title">Social media<br />that <em>pays attention.</em></h1>
            <p className="lead-copy">Post videos, pictures, music and quotes your way.</p>
            <div className="button-row">
              <Link className="button-primary" to="/get-the-app">Get the app <span className="button-arrow" aria-hidden="true">↗</span></Link>
            </div>
            <div className="hero-meta"><span>South Africa</span><i /> <span>In testing</span></div>
          </div>
          <FrequencyPhone />
        </div>
      </section>

      <AppScrollStory />

      <section className="section warm-section">
        <div className="page-container story-grid">
          <div>
            <p className="section-kicker">Business workspace</p>
            <h2 className="section-title">Create Mission.</h2>
            <p className="section-lead">Sign in as a brand, add your brief and campaign media, then set a reward pool.</p>
            <div className="button-row"><Link className="button-primary" to="/business/create">Create a Mission <span className="button-arrow" aria-hidden="true">↗</span></Link></div>
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
            </div>
          </ScrollReveal>
          <div className="rollout-rail">
            <article><span className="rollout-status">PRE-RELEASE</span><h3>Live streaming</h3></article>
            <article><span className="rollout-status">MARKETPLACE · REVIEW</span><h3>Marketplace</h3></article>
            <article><span className="rollout-status">FREQUENCY SOS · STAGING</span><h3>Frequency SOS</h3></article>
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
