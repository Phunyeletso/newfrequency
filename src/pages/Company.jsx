import { Link } from "react-router-dom";
import ScrollReveal from "../components/ScrollReveal";
import useDocumentTitle from "../lib/useDocumentTitle";
import "../story.css";

export default function Company() {
  useDocumentTitle("About newFrequency", "Born in South Africa. Built around the people who create, share and connect.");
  return (
    <div className="frequency-story frequency-secondary frequency-company">
      <section className="frequency-hero" aria-labelledby="company-title">
        <div className="page-container frequency-hero-grid">
          <div className="frequency-hero-copy"><p className="eyebrow"><span className="signal-dot" /> About newFrequency</p><h1 id="company-title">Make room<br />for the next<br /><em>voice.</em></h1><p className="frequency-hero-lead">Born in South Africa.<br />Built around the people who make it.</p><div className="button-row"><Link className="button-primary" to="/get-the-app">Find your frequency <span aria-hidden="true">↗</span></Link></div></div>
          <div className="frequency-company-art" aria-hidden="true"><span>South Africa / newFrequency</span><svg viewBox="0 0 48 48" fill="none"><path d="M24 5v38M5 24h38M10.6 10.6l26.8 26.8M10.6 37.4l26.8-26.8" /></svg><strong>Made here.<br />Shared<br />everywhere.</strong><i /></div>
        </div>
      </section>

      <section className="frequency-editorial-section frequency-editorial-tint" aria-labelledby="company-belief-title">
        <div className="page-container frequency-editorial-split">
          <ScrollReveal><p className="section-kicker">What brings us together</p><h2 className="frequency-editorial-title" id="company-belief-title">People make<br /><em>the frequency.</em></h2></ScrollReveal>
          <ScrollReveal delay={90}><p className="frequency-editorial-copy">Video, photos, conversation and music.<br />A space shaped by the people in it.</p><Link className="frequency-chapter-link" to="/creators">Meet your next chapter <span aria-hidden="true">→</span></Link></ScrollReveal>
        </div>
      </section>

      <section className="frequency-editorial-section" aria-label="What matters to newFrequency">
        <div className="page-container frequency-steps-grid">
          {[
            ["01", "Every side of you.", "Reels, Tunes, Snaps and Chats. Different ways to make your mark."],
            ["02", "Built together.", "Your feedback helps shape what comes next."],
            ["03", "Your space. Your say.", "Clear rules, account controls and safety information."],
          ].map(([number, title, copy], index) => <ScrollReveal key={number} delay={index * 75}><article className="frequency-step-card"><span>{number}</span><h2>{title}</h2><p>{copy}</p>{number === "02" && <Link className="frequency-chapter-link" to="/feedback">Give feedback <span aria-hidden="true">→</span></Link>}{number === "03" && <Link className="frequency-chapter-link" to="/child-safety">Our safety approach <span aria-hidden="true">→</span></Link>}</article></ScrollReveal>)}
        </div>
      </section>

      <section className="frequency-finale"><div className="page-container"><ScrollReveal><p className="section-kicker">The next chapter</p><h2>Let's make<br /><em>something.</em></h2><div className="button-row"><Link className="button-primary" to="/contact">Talk to us</Link><Link className="frequency-explore-link" to="/business">Business enquiries <span aria-hidden="true">→</span></Link></div></ScrollReveal></div></section>
    </div>
  );
}
