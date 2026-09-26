import { Link } from "react-router-dom";
import TuneNetwork from "../components/TuneNetwork";
import ScrollReveal from "../components/ScrollReveal";
import useDocumentTitle from "../lib/useDocumentTitle";

export default function ForArtists() {
  useDocumentTitle("For artists", "Share a Tune on newFrequency and let other creators use it as audio. See how music works in the app.");

  return (
    <>
      <section className="story-hero">
        <div className="page-container story-grid">
          <div>
            <p className="eyebrow"><span className="signal-dot" /> For artists</p>
            <h1 className="display-title">Put a sound out.<br /><em>See where it goes.</em></h1>
            <p className="lead-copy">A Tune is a music post that another creator can select as audio for a Reel, Snap or Chat post. The next idea belongs to them.</p>
            <div className="button-row">
              <Link className="button-primary" to="/get-the-app">Check app access <span className="button-arrow" aria-hidden="true">↗</span></Link>
              <Link className="button-secondary" to="/creators">For every creator</Link>
            </div>
          </div>
          <div className="artist-sound" aria-label="A Tune shown as a soundwave"><div className="sound-disc"><span>YOUR TUNE</span><div className="sound-bars" aria-hidden="true">{Array.from({ length: 19 }, (_, i) => <i key={i} />)}</div></div></div>
        </div>
      </section>

      <section className="section music-section">
        <div className="page-container music-grid">
          <ScrollReveal>
            <p className="section-kicker">One Tune, many interpretations</p>
            <h2 className="section-title">Your music travels further than you do.</h2>
            <p className="music-note">A creator picks a Tune and makes something new with it. Their post carries the sound into another corner of the feed.</p>
            <p className="music-note">The current product does not create a per-use or streaming royalty for Tune reuse. Any creator earnings come from eligible support attached to content, under the app’s terms.</p>
          </ScrollReveal>
          <ScrollReveal delay={120}><TuneNetwork /></ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <ScrollReveal>
            <p className="section-kicker">How to put a Tune out</p>
            <h2 className="section-title">Share with care.</h2>
            <p className="section-lead">The app asks artists to upload music they created or have permission to share. A Tune is a post format, not a music-rights marketplace.</p>
          </ScrollReveal>
          <div className="story-rail" style={{ marginTop: 40 }}>
            <article><span>01</span><h3>Choose your track</h3><p>Share music you have the rights and necessary permissions to post.</p></article>
            <article><span>02</span><h3>Post it as a Tune</h3><p>Your Tune appears as music other creators can select for their own posts.</p></article>
            <article><span>03</span><h3>Keep the terms clear</h3><p>How a Tune may be shared is governed by the app’s terms. Reuse is not an earnings guarantee.</p></article>
          </div>
          <p className="rights-note" style={{ marginTop: 25 }}>Only upload recordings you made or are authorised to share. Do not assume that a newFrequency Tune grants rights for use outside the app, in paid advertising, or in any way that the app’s current terms do not expressly cover.</p>
        </div>
      </section>

      <section className="closing-section">
        <div className="page-container"><div className="closing-panel">
          <p className="section-kicker">Made to be picked up</p>
          <h2>Give your sound a place in the feed.</h2>
          <p>newFrequency is in testing. Check current access for your device, then tell us what an artist needs next.</p>
          <div className="button-row"><Link className="button-primary" to="/get-the-app">Check app access</Link><Link className="button-secondary" to="/contact">Contact the team</Link></div>
        </div></div>
      </section>
    </>
  );
}
