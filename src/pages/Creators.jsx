import { Link } from "react-router-dom";
import FrequencyPhone from "../components/FrequencyPhone";
import ScrollReveal from "../components/ScrollReveal";
import useDocumentTitle from "../lib/useDocumentTitle";

const FLOW = [
  ["01", "Make the post", "Shoot a Reel, share a Snap, write a Chat post or put out a Tune."],
  ["02", "Find your people", "Let the feed and the formats you follow bring new work into view."],
  ["03", "Let support be direct", "People can send coin gifts or take part in eligible paid-scroll activity where available."],
];

export default function Creators() {
  useDocumentTitle("For creators", "Make Reels, Snaps, Chat posts and music on newFrequency. Learn how creator support works and what is still in testing.");

  return (
    <>
      <section className="story-hero">
        <div className="page-container story-grid">
          <div>
            <p className="eyebrow"><span className="signal-dot" /> For creators</p>
            <h1 className="display-title">Make the work.<br /><em>Meet its people.</em></h1>
            <p className="lead-copy">Short video, photos, text and music can live together in one place—so your next idea does not have to fit somebody else’s format.</p>
            <div className="button-row">
              <Link className="button-primary" to="/get-the-app">Check app access <span className="button-arrow" aria-hidden="true">↗</span></Link>
              <Link className="button-secondary" to="/for-artists">I make music</Link>
            </div>
            <p className="fine-print">Early test build. Some creator tools and earning features depend on rollout and eligibility.</p>
          </div>
          <div className="story-visual"><FrequencyPhone /></div>
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <ScrollReveal>
            <p className="section-kicker">The creator loop</p>
            <h2 className="section-title">Create. Reach. Receive support.</h2>
            <p className="section-lead">A simple path, with no promise about how far a post will travel or what it will earn.</p>
          </ScrollReveal>
          <div className="creator-flow" style={{ marginTop: 42 }}>
            {FLOW.map(([number, title, description]) => (
              <ScrollReveal key={number} delay={Number(number) * 55}>
                <article className="flow-step">
                  <span className="flow-step-num">{number} / 03</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section music-section">
        <div className="page-container story-grid">
          <div>
            <p className="section-kicker">Ways to share</p>
            <h2 className="section-title">Choose the shape of the story.</h2>
            <p className="section-lead">Reels, Snaps, Chat and Tunes are the core post formats in the app. Live streaming and advertising are not promoted as available features while their release checks remain open.</p>
          </div>
          <div className="story-rail">
            {[
              ["01", "Reels", "Short video, shot in the app or selected from your camera roll."],
              ["02", "Snaps + Chat", "A photo or a thought, shared on its own terms."],
              ["03", "Tunes", "Music posts that others can choose as audio for their posts."],
            ].map(([n, title, copy]) => (
              <article key={title}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <ScrollReveal>
            <div className="support-band">
              <div>
                <p className="section-kicker">Support, with the details up front</p>
                <h2>People can back the work they choose.</h2>
                <p>Where enabled, newFrequency supports coin gifts and a paid feed for eligible posts. A creator’s earnings depend on actual support, account eligibility and the app’s current terms.</p>
              </div>
              <div>
                <div className="support-list">
                  <div><strong>Coin gifts</strong><span>Digital gifts from supporters</span></div>
                  <div><strong>Eligible paid views</strong><span>Limited to supported feed activity</span></div>
                  <div><strong>Creator earnings</strong><span>Not guaranteed; withdrawal availability varies</span></div>
                </div>
                <p className="fine-print">Purchased coins are non-withdrawable. Only eligible creator earnings can enter the separate payout process, which remains subject to rollout and verification.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="closing-section">
        <div className="page-container"><div className="closing-panel">
          <p className="section-kicker">Keep making</p>
          <h2>Put your work out there.</h2>
          <p>See whether the test build is available on your device. If you try it, tell us what you would keep and what you would change.</p>
          <div className="button-row"><Link className="button-primary" to="/get-the-app">Check app access</Link><Link className="button-secondary" to="/feedback">Give feedback</Link></div>
        </div></div>
      </section>
    </>
  );
}
