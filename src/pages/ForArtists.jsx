import { Link } from "react-router-dom";
import TuneNetwork from "../components/TuneNetwork";
import ScrollReveal from "../components/ScrollReveal";
import useDocumentTitle from "../lib/useDocumentTitle";
import "../story.css";

export default function ForArtists() {
  useDocumentTitle("For artists", "Share your sound as a Tune. Let creators make it part of their next story on newFrequency.");
  return (
    <div className="frequency-story frequency-secondary frequency-artists">
      <section className="frequency-hero" aria-labelledby="artists-title">
        <div className="page-container frequency-hero-grid">
          <div className="frequency-hero-copy">
            <p className="eyebrow"><span className="signal-dot" /> For artists</p>
            <h1 id="artists-title">Your sound.<br /><em>Their story.</em></h1>
            <p className="frequency-hero-lead">Post a Tune.<br />Let someone make a moment with it.</p>
            <div className="button-row"><Link className="button-primary" to="/get-the-app">Get the app <span aria-hidden="true">↗</span></Link><Link className="frequency-explore-link" to="/creators">For every creator <span aria-hidden="true">→</span></Link></div>
          </div>
          <div className="frequency-sound-art" aria-hidden="true"><div className="frequency-sound-rings"><i /><i /><i /></div><div className="frequency-sound-record"><span>YOUR TUNE</span><div className="frequency-sound-wave">{[26, 52, 36, 67, 43, 75, 52, 33, 62, 41, 68, 29, 46].map((height, i) => <i style={{ "--wave-height": `${height}px` }} key={i} />)}</div><strong>Let it travel.</strong></div><span className="frequency-sound-label">Same sound. New ideas.</span></div>
        </div>
      </section>

      <section className="frequency-editorial-section frequency-editorial-tint" aria-labelledby="sound-travel-title">
        <div className="page-container music-grid">
          <ScrollReveal><p className="section-kicker">One Tune. Many possibilities.</p><h2 className="frequency-editorial-title" id="sound-travel-title">Hear it<br /><em>somewhere new.</em></h2><p className="frequency-editorial-copy">Post a Tune. Other creators can choose it as audio for a post.</p></ScrollReveal>
          <ScrollReveal delay={100}><TuneNetwork /></ScrollReveal>
        </div>
      </section>

      <section className="frequency-editorial-section" aria-labelledby="post-tune-title">
        <div className="page-container">
          <ScrollReveal><p className="section-kicker">From you to the feed</p><h2 className="frequency-editorial-title" id="post-tune-title">Make it.<br /><em>Share it.</em></h2></ScrollReveal>
          <div className="frequency-steps-grid">
            {[
              ["01", "Upload your sound.", "Music you made or are authorised to share."],
              ["02", "Post a Tune.", "Your sound becomes part of the feed."],
              ["03", "See where it goes.", "Creators can select it for a new post."],
            ].map(([number, title, copy], index) => <ScrollReveal key={number} delay={index * 75}><article className="frequency-step-card"><span>{number}</span><h3>{title}</h3><p>{copy}</p></article></ScrollReveal>)}
          </div>
          <p className="frequency-rights-note">Upload only recordings you made or are authorised to share. Music licences are not sold through newFrequency.</p>
        </div>
      </section>

      <section className="frequency-finale"><div className="page-container"><ScrollReveal><p className="section-kicker">Made to be picked up</p><h2>Let them<br /><em>hear you.</em></h2><div className="button-row"><Link className="button-primary" to="/get-the-app">Get the app</Link><Link className="frequency-explore-link" to="/contact">Talk to the team <span aria-hidden="true">→</span></Link></div></ScrollReveal></div></section>
    </div>
  );
}
