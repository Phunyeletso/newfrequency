import { Link } from "react-router-dom";
import FrequencyPhone from "../components/FrequencyPhone";
import AppScrollStory from "../components/AppScrollStory";
import TuneNetwork from "../components/TuneNetwork";
import ScrollReveal from "../components/ScrollReveal";
import useDocumentTitle from "../lib/useDocumentTitle";

export default function Home() {
  useDocumentTitle(null, "Reels, photos, text and music in one creator-led social app. Meet newFrequency, now in testing.");

  return (
    <>
      <section className="hero">
        <div className="page-container-wide hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span className="signal-dot" /> A social app for people who make things</p>
            <h1 className="display-title">Create.<br />Connect.<br /><em>Keep it moving.</em></h1>
            <p className="lead-copy">
              Video, photos, words and music meet in one feed. Follow a post into a conversation, a Tune, a Trail or a way to support its creator.
            </p>
            <div className="button-row">
              <Link className="button-primary" to="/get-the-app">Get the app <span className="button-arrow" aria-hidden="true">↗</span></Link>
              <Link className="button-secondary" to="/creators">For creators</Link>
            </div>
            <div className="hero-meta"><span>South Africa</span><i /> <span>Early test build</span><i /> <span>Four ways to post</span></div>
          </div>
          <FrequencyPhone />
        </div>
      </section>

      <AppScrollStory />

      <section className="section music-section">
        <div className="page-container music-grid">
          <ScrollReveal className="music-copy">
            <p className="section-kicker">Tunes move through people</p>
            <h2 className="section-title">A sound can start more than one story.</h2>
            <p className="music-note">
              Artists post a Tune. Other creators can select it as audio for a Reel, Snap or Chat post. One sound, heard through different ideas.
            </p>
            <p className="music-note">
              Tune reuse does not create a per-play royalty in the current product. Upload music you have the right to share; support and earnings follow the app’s terms.
            </p>
            <div className="button-row"><Link className="text-link" to="/for-artists">Explore music on newFrequency <span aria-hidden="true">→</span></Link></div>
          </ScrollReveal>
          <ScrollReveal delay={100}><TuneNetwork /></ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <ScrollReveal>
            <div className="support-band">
              <div>
                <p className="section-kicker">Support that stays direct</p>
                <h2>Good work deserves a way to be backed.</h2>
                <p>Where available, people can support creators with coin gifts and eligible paid-scroll activity. Creators may earn from legitimate support under the app’s rules.</p>
              </div>
              <div>
                <div className="support-list" aria-label="Support features">
                  <div><strong>Coin gifts</strong><span>Support a creator’s work</span></div>
                  <div><strong>Eligible paid views</strong><span>One coin when a view qualifies</span></div>
                  <div><strong>Creator earnings</strong><span>Subject to eligibility and rollout</span></div>
                </div>
                <p className="fine-print">No guaranteed income. The current test build and account eligibility affect what is available.</p>
                <Link className="text-link" to="/creators">How creator support works <span aria-hidden="true">→</span></Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section warm-section">
        <div className="page-container story-grid">
          <div>
            <p className="section-kicker">For brands with a brief</p>
            <h2 className="section-title">Give creators something worth making.</h2>
            <p className="section-lead">Brands can create and save a private Mission brief in the Business workspace. Submission review uses the shared app backend when configured; verification, funding and public launch still need release checks.</p>
            <div className="button-row"><Link className="button-primary" to="/business">Explore Business <span className="button-arrow" aria-hidden="true">↗</span></Link></div>
          </div>
          <div className="story-visual" aria-hidden="true">
            <div className="story-visual-orbit" />
            <div className="story-statement">
              <span className="story-statement-mark">✳</span>
              <span className="network-node-kicker">MISSION IN PROGRESS</span>
              <h2>Brief.<br />Make.<br />Review.</h2>
              <p>Brief creators, collect responses, review the work.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section rollout-section" aria-labelledby="rollout-title">
        <div className="page-container">
          <ScrollReveal>
            <div className="section-topline">
              <div>
                <p className="section-kicker">The app keeps growing</p>
                <h2 className="section-title" id="rollout-title">Some tools need field proof first.</h2>
              </div>
              <p className="section-lead">These flows exist in the current app source. Provider, staging, legal or device checks still determine when they open.</p>
            </div>
          </ScrollReveal>
          <div className="rollout-rail">
            <article><span className="rollout-status">LIVE STREAMING · PRE-RELEASE</span><h3>Go live together</h3><p>Provider setup and native-device broadcast and playback checks remain.</p></article>
            <article><span className="rollout-status">MARKETPLACE · REVIEW</span><h3>Trade with clear terms</h3><p>Legal, seller verification and dispute/refund operations need review before public real-money use.</p></article>
            <article><span className="rollout-status">FREQUENCY SOS · STAGING</span><h3>Safety tools, carefully tested</h3><p>Live dispatch stays closed pending consented staging and real-device delivery checks.</p></article>
          </div>
        </div>
      </section>

      <section className="closing-section">
        <div className="page-container">
          <ScrollReveal>
            <div className="closing-panel">
              <p className="section-kicker">Your next post starts here</p>
              <h2>Find your frequency.</h2>
              <p>newFrequency is in testing. See what is currently available, then tell us what should change.</p>
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
