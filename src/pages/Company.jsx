import { Link } from "react-router-dom";
import ScrollReveal from "../components/ScrollReveal";
import useDocumentTitle from "../lib/useDocumentTitle";

export default function Company() {
  useDocumentTitle("About newFrequency", "A South African creator-social app in testing, built around video, photos, conversation and music.");
  return (
    <>
      <section className="story-hero">
        <div className="page-container">
          <p className="eyebrow"><span className="signal-dot" /> About newFrequency</p>
          <h1 className="display-title">Make room<br />for the next<br /><em>voice.</em></h1>
          <p className="lead-copy">newFrequency is a South African creator-social app in testing. It brings video, photos, text and music together around the people who make them.</p>
        </div>
      </section>
      <section className="section music-section">
        <div className="page-container story-grid">
          <div><p className="section-kicker">Our point of view</p><h2 className="section-title">A social app is a place people shape together.</h2></div>
          <p className="section-lead">The feed is only the beginning. We are exploring how creator support, music and brand briefs can fit into the same community—while making account safety, fair rules and clear money flows part of the work.</p>
        </div>
      </section>
      <section className="section">
        <div className="page-container">
          <ScrollReveal>
            <div className="company-points">
              <article><h2>Built for many forms</h2><p>Reels, Snaps, Chat and Tunes are the core ways to publish in the current app.</p></article>
              <article><h2>Testing in the open</h2><p>The product is early. The site states what is available and what still needs release work.</p></article>
              <article><h2>Grounded in South Africa</h2><p>newFrequency is being built for a community with a strong culture of making and sharing.</p></article>
            </div>
          </ScrollReveal>
        </div>
      </section>
      <section className="closing-section"><div className="page-container"><div className="closing-panel">
        <p className="section-kicker">Talk to us</p><h2>We are still learning.</h2><p>Send feedback, ask a question or tell us what creators need next.</p>
        <div className="button-row"><Link className="button-primary" to="/feedback">Give feedback</Link><Link className="button-secondary" to="/contact">Contact</Link></div>
      </div></div></section>
    </>
  );
}
