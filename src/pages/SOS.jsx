import useDocumentTitle from "../lib/useDocumentTitle";

export default function SOS() {
  useDocumentTitle("SOS", "Say “Help me” to trigger SOS AI. It will alert nearby users and automatically send them your location so they can send help.");

  return (
    <section className="story-hero">
      <div className="page-container">
        <div className="max-w-prose">
          <p className="eyebrow"><span className="signal-dot" /> SOS</p>
          <h1 className="display-title">Need <em>help?</em></h1>
          <p className="lead-copy">Say “Help me” to trigger SOS AI. It will alert nearby users and automatically send them your location so they can send help.</p>
        </div>
      </div>
    </section>
  );
}
