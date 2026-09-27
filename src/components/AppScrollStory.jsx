import { useEffect, useRef, useState } from "react";

const FEED_TYPES = ["Reels", "Tunes", "Snaps", "Chats"];

const CHAPTERS = [
  {
    id: "reels",
    format: "Reels",
    scene: "reels",
    kicker: "Reels",
    title: "Real talent, from the people who made it.",
    copy: "Short video, with creator details and post actions in the feed.",
  },
  {
    id: "snaps",
    format: "Snaps",
    scene: "snaps",
    kicker: "Snaps",
    title: "Post videos, pictures and quotes your way.",
    copy: "Share a photo in the same creator feed.",
  },
  {
    id: "chats",
    format: "Chats",
    scene: "chats",
    kicker: "Chats",
    title: "Chats",
    copy: "Text posts have a place in the feed.",
  },
  {
    id: "tunes",
    format: "Tunes",
    scene: "tunes",
    kicker: "Tunes",
    title: "Choose a Tune as audio for a new post.",
    copy: "Artists post Tunes for creators to select as audio.",
  },
  {
    id: "support",
    format: "Reels",
    scene: "support",
    kicker: "Creator support",
    title: "Creator support.",
    copy: "Coin gifts and eligible paid views use Frequency Coins where enabled.",
    status: "Eligibility and rollout apply.",
  },
  {
    id: "missions",
    format: "Reels",
    scene: "missions",
    kicker: "Business workspace",
    title: "Create Mission.",
    copy: "Save a private Mission draft. Public funding and launch remain gated.",
  },
];

function StoryScene({ chapter }) {
  if (chapter.scene === "missions") {
    return <div className="story-mission-card"><span>BUSINESS WORKSPACE</span><b aria-hidden="true">✳</b><strong>Create Mission.</strong><small>Private draft</small></div>;
  }
  if (chapter.scene === "chats") {
    return <div className="story-chat-card"><span>CHATS</span><strong>Text post</strong><i /><i /><i /></div>;
  }
  if (chapter.scene === "tunes") {
    return <div className="story-tune-card"><span>TUNES</span><div className="story-wave" aria-hidden="true">{Array.from({ length: 27 }, (_, index) => <i key={index} />)}</div><strong>Choose a Tune as audio for a new post.</strong></div>;
  }
  if (chapter.scene === "trails") {
    return <div className="story-trail-card"><span>FREQUENCY TRAIL</span><div className="trail-branches"><i /><i /><i /><b /></div><strong>Source → response → next idea</strong></div>;
  }
  if (chapter.scene === "support") {
    return <div className="story-wallet-card"><span>CREATOR SUPPORT</span><strong>Frequency Coins</strong><div><i>Coin gifts</i><b aria-hidden="true">+</b><i>Eligible paid views</i></div><small>Eligibility applies</small></div>;
  }
  return <div className={`story-media-art story-media-${chapter.scene}`}>
    <img src="/media/feed-performance.webp" alt="" />
    <span>{chapter.scene === "reels" ? "REELS" : "SNAPS"}</span>
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
            <p className="section-kicker">Inside the feed</p>
            <h2 className="section-title">Post videos, pictures and quotes your way.</h2>
          </div>
          <p className="section-lead">Reels · Tunes · Snaps · Chats</p>
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
