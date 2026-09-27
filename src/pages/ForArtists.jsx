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
            <h1 className="display-title">Tunes.</h1>
            <p className="lead-copy">Choose a Tune as audio for a new post.</p>
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
            <h2 className="section-title">Tunes.</h2>
            <p className="music-note">Artists post Tunes. Creators can choose a Tune as audio for a new post.</p>
            <p className="music-note">Tune reuse does not create a per-play royalty.</p>
          </ScrollReveal>
          <ScrollReveal delay={120}><TuneNetwork /></ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <ScrollReveal>
            <p className="section-kicker">How to put a Tune out</p>
            <h2 className="section-title">Post a Tune.</h2>
            <p className="section-lead">Upload music you created or are authorised to share.</p>
          </ScrollReveal>
          <div className="story-rail" style={{ marginTop: 40 }}>
            <article><span>01</span><h3>Upload</h3><p>Share music you are authorised to post.</p></article>
            <article><span>02</span><h3>Post</h3><p>Creators can select it as audio.</p></article>
            <article><span>03</span><h3>Reuse</h3><p>App terms apply. Reuse does not promise earnings.</p></article>
          </div>
          <p className="rights-note" style={{ marginTop: 25 }}>Only upload recordings you made or are authorised to share. A Tune does not grant rights outside the app.</p>
        </div>
      </section>

      <section className="closing-section">
        <div className="page-container"><div className="closing-panel">
          <p className="section-kicker">Made to be picked up</p>
          <h2>Tunes.</h2>
          <p>newFrequency is in testing. Check current access for your device, then tell us what an artist needs next.</p>
          <div className="button-row"><Link className="button-primary" to="/get-the-app">Check app access</Link><Link className="button-secondary" to="/contact">Contact the team</Link></div>
        </div></div>
      </section>
    </>
  );
}
