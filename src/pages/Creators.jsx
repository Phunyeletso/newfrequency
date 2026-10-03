import useDocumentTitle from "../lib/useDocumentTitle";
import "../story.css";

export default function Creators() {
  useDocumentTitle("For creators", "No follower threshold to earn from eligible coin-funded paid scrolls and gifts on newFrequency.");

  return (
    <div className="frequency-story frequency-secondary">
      <section className="frequency-hero" aria-labelledby="creators-title">
        <div className="page-container">
          <div className="frequency-hero-copy creator-earnings-hero">
            <p className="eyebrow"><span className="signal-dot" /> For creators</p>
            <h1 id="creators-title">No follower<br />count needed<br />to <em>earn.</em></h1>
            <p className="frequency-hero-lead">Earn through brand deals, ad revenue sharing, paid scrolls and gifts on your posts, live streams and comments.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
