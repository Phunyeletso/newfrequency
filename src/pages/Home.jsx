import FrequencyPhone from "../components/FrequencyPhone";
import useDocumentTitle from "../lib/useDocumentTitle";
import "../story.css";

export default function Home() {
  useDocumentTitle(null, "Social media that pays attention. Get the newFrequency app for Android or request an iOS invite.");

  return (
    <div className="frequency-story">
      <section className="frequency-hero frequency-home-hero" aria-labelledby="frequency-hero-title">
        <div className="page-container frequency-hero-grid frequency-home-content">
          <div className="frequency-hero-copy frequency-home-copy">
            <h1 id="frequency-hero-title">Social media<br />that <em>pays attention.</em></h1>
          </div>
          <FrequencyPhone />
        </div>
      </section>
    </div>
  );
}
