import { Link } from "react-router-dom";
import FrequencyPhone from "../components/FrequencyPhone";
import ScrollReveal from "../components/ScrollReveal";
import useDocumentTitle from "../lib/useDocumentTitle";

const FLOW = [
  ["01", "Post", "Reels, Snaps, Chats or Tunes."],
  ["02", "Discover", "Find creators and communities in the feed."],
  ["03", "Support", "Coin gifts and eligible paid views where enabled."],
];

export default function Creators() {
  useDocumentTitle("For creators", "Make Reels, Snaps, Chat posts and music on newFrequency. Learn how creator support works and what is still in testing.");

  return (
    <>
      <section className="story-hero">
        <div className="page-container story-grid">
          <div>
            <p className="eyebrow"><span className="signal-dot" /> For creators</p>
            <h1 className="display-title"><em>Real talent,<br />from the people<br />who made it.</em></h1>
            <p className="lead-copy">Post videos, pictures and quotes your way.</p>
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
            <p className="section-kicker">For creators</p>
            <h2 className="section-title">Post. Discover. Support.</h2>
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
            <p className="section-kicker">Post formats</p>
            <h2 className="section-title">Post your way.</h2>
            <p className="section-lead">Reels, Snaps, Chats and Tunes.</p>
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
                <p className="section-kicker">Creator support</p>
                <h2>Creator support.</h2>
                <p>Coin gifts and eligible paid views use Frequency Coins where enabled.</p>
              </div>
              <div>
                <div className="support-list">
                  <div><strong>Coin gifts</strong><span>Digital gifts from supporters</span></div>
                  <div><strong>Eligible paid views</strong><span>Limited to supported feed activity</span></div>
                  <div><strong>Creator earnings</strong><span>Not guaranteed; withdrawal availability varies</span></div>
                </div>
                <p className="fine-print">Eligibility and rollout apply. Purchased Coins are non-withdrawable.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="closing-section">
        <div className="page-container"><div className="closing-panel">
          <p className="section-kicker">Keep making</p>
          <h2>Put your work out there.</h2>
          <p>Now in testing.</p>
          <div className="button-row"><Link className="button-primary" to="/get-the-app">Check app access</Link><Link className="button-secondary" to="/feedback">Give feedback</Link></div>
        </div></div>
      </section>
    </>
  );
}
