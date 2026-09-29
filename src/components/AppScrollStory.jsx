import { useEffect, useRef, useState } from "react";

const FEED_TYPES = ["Reels", "Tunes", "Snaps", "Chats"];

const CHAPTERS = [
  {
    id: "discover",
    format: "Reels",
    scene: "discover",
    kicker: "Discover",
    title: "Discover creators and communities.",
    copy: "Find creators and communities through the feed.",
  },
  {
    id: "live",
    format: "LIVE",
    scene: "live",
    kicker: "Live",
    title: "Go live and grow your audience.",
    copy: "Connect with your community in real time.",
    status: "Live is in pre-release.",
  },
  {
    id: "missions",
    format: "Reels",
    scene: "missions",
    kicker: "Creator Missions",
    title: "Discover creator Mission opportunities.",
    copy: "Turn your creativity into real brand rewards.",
    status: "Creator Missions are in development.",
  },
  {
    id: "monetization",
    format: "Snaps",
    scene: "monetization",
    kicker: "Monetization",
    title: "All creators are automatically eligible for monetization.",
    copy: "No follower threshold. Eligible paid views and gifts.",
  },
];

function StoryScene({ chapter }) {
  if (chapter.scene === "live") {
    return <div className="story-live-card"><img src="/media/feed-performance.webp" alt="" /><span>LIVE</span><strong>Go live</strong><small>PRE-RELEASE</small></div>;
  }
  if (chapter.scene === "missions") {
    return <div className="story-mission-card"><span>CREATOR MISSION</span><b aria-hidden="true">✳</b><strong>A brief. Your creative direction.</strong><small>In development</small></div>;
  }
  if (chapter.scene === "monetization") {
    return <div className="story-wallet-card"><span>CREATOR MONETIZATION</span><strong>No follower threshold</strong><div><i>Gifts</i><b aria-hidden="true">+</b><i>Eligible paid views</i></div></div>;
  }
  return <div className={`story-media-art story-media-${chapter.scene}`}>
    <img src="/media/feed-performance.webp" alt="" />
    <span>DISCOVER</span>
    <i aria-hidden="true" />
    <b aria-hidden="true" />
  </div>;
}

export default function AppScrollStory() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef([]);
  const active = CHAPTERS[activeIndex];

  useEffect(() => {
    let frame = 0;
    const updateActiveChapter = () => {
      frame = 0;
      const viewportCenter = window.innerHeight / 2;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      stepRefs.current.forEach((step, index) => {
        if (!step) return;
        const bounds = step.getBoundingClientRect();
        const center = bounds.top + bounds.height / 2;
        const distance = Math.abs(center - viewportCenter);
        const containsCenter = bounds.top <= viewportCenter && bounds.bottom >= viewportCenter;
        const score = containsCenter ? distance - window.innerHeight : distance;
        if (score < nearestDistance) {
          nearestDistance = score;
          nearestIndex = index;
        }
      });

      setActiveIndex((current) => current === nearestIndex ? current : nearestIndex);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveChapter);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="section app-story" id="product">
      <div className="page-container">
        <div className="section-topline">
          <div>
            <p className="section-kicker">Inside newFrequency</p>
            <h2 className="section-title">Different vibes. Same frequency.</h2>
          </div>
        </div>

        <div className="app-story-layout">
          <div className="app-story-stage">
            <p className="app-story-preview-label">Feed preview</p>
            <div className="app-story-device" aria-hidden="true">
              <div className="app-story-screen">
                <header className="app-story-topbar">
                  <span className="app-story-wordmark">newFrequency</span>
                  <span className="app-story-signal" />
                </header>
                <div className="app-story-tabs">
                  <span className="app-story-live">LIVE</span>
                  {FEED_TYPES.map((format) => <span key={format} className={active.format === format ? "active" : ""}>{format}</span>)}
                </div>
                <div className={`app-story-post app-story-post-${active.scene}`} key={active.id}>
                  <StoryScene chapter={active} />
                  <div className="app-story-author"><b>nf</b><span>newFrequency<br /><small>{active.kicker}</small></span></div>
                  <div className="app-story-actions"><i>♡</i><i>▢</i><i>↗</i><i>♧</i></div>
                </div>
                <div className="app-story-bottom"><span>Home</span><span>Explore</span><b>+</b><span>Inbox</span><span>Profile</span></div>
              </div>
            </div>
            <p className="app-story-caption">Illustrative app UI</p>
          </div>

          <div className="app-story-steps">
            {CHAPTERS.map((chapter, index) => (
              <article
                className={`app-story-step ${activeIndex === index ? "is-active" : ""}`}
                id={`product-story-${chapter.id}`}
                key={chapter.id}
                ref={(node) => { stepRefs.current[index] = node; }}
                aria-current={activeIndex === index ? "step" : undefined}
              >
                <p className="app-story-kicker"><span>{String(index + 1).padStart(2, "0")}</span>{chapter.kicker}</p>
                <h3>{chapter.title}</h3>
                <p className="app-story-copy">{chapter.copy}</p>
                {chapter.status && <p className="app-story-status"><span className="signal-dot" />{chapter.status}</p>}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
