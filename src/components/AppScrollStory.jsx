import { useEffect, useRef, useState } from "react";

const FEED_TYPES = ["Reels", "Tunes", "Snaps", "Chats"];

const CHAPTERS = [
  {
    id: "reels",
    format: "Reels",
    scene: "reels",
    kicker: "Make a Reel",
    title: "A video can make the first move.",
    copy: "Reels put a creator's short video into the full-screen feed, with the conversation and post actions close by.",
  },
  {
    id: "snaps",
    format: "Snaps",
    scene: "snaps",
    kicker: "Share a Snap",
    title: "A still can hold the whole moment.",
    copy: "Photos have their own place in the feed, beside video, music and text.",
  },
  {
    id: "chats",
    format: "Chats",
    scene: "chats",
    kicker: "Start with a thought",
    title: "A post can give people something to answer.",
    copy: "Chat posts make room for text-first thoughts and the conversation that follows.",
  },
  {
    id: "tunes",
    format: "Tunes",
    scene: "tunes",
    kicker: "Let a Tune travel",
    title: "One sound, heard through new ideas.",
    copy: "Artists post Tunes; creators can select a Tune as audio for a new post. Reuse does not create a per-play royalty.",
  },
  {
    id: "trails",
    format: "Reels",
    scene: "trails",
    kicker: "Connect the source",
    title: "A response can carry its context with it.",
    copy: "Frequency Trails link a response, remix, sample or continuation to an earlier post. They show attribution; they do not grant rights or promise earnings.",
    status: "Staging and release-device verification remain open.",
  },
  {
    id: "support",
    format: "Reels",
    scene: "support",
    kicker: "Support the work",
    title: "The feed connects attention to creator support.",
    copy: "Tips, gifts and eligible paid views can use Frequency Coins. Purchased Coins stay separate from ZAR creator earnings; availability depends on release and eligibility checks.",
    status: "Store purchase, database and release-device checks remain open.",
  },
];

function StoryScene({ chapter }) {
  if (chapter.scene === "chats") {
    return <div className="story-chat-card"><span>CHAT POST</span><strong>A thought can start a conversation.</strong><i /><i /><i /></div>;
  }
  if (chapter.scene === "tunes") {
    return <div className="story-tune-card"><span>TUNE · ORIGINAL AUDIO</span><div className="story-wave" aria-hidden="true">{Array.from({ length: 27 }, (_, index) => <i key={index} />)}</div><strong>Choose a sound for your post.</strong></div>;
  }
  if (chapter.scene === "trails") {
    return <div className="story-trail-card"><span>FREQUENCY TRAIL</span><div className="trail-branches"><i /><i /><i /><b /></div><strong>Source → response → next idea</strong></div>;
  }
  if (chapter.scene === "support") {
    return <div className="story-wallet-card"><span>IN THE APP</span><strong>Support stays clear.</strong><div><i>Frequency Coins</i><b aria-hidden="true">↔</b><i>Creator earnings</i></div><small>Separate balances · eligibility applies</small></div>;
  }
  return <div className={`story-media-art story-media-${chapter.scene}`}>
    <span>{chapter.scene === "reels" ? "REEL · VIDEO" : "SNAP · PHOTO"}</span>
    <i aria-hidden="true" />
    {chapter.scene === "reels" && <b aria-hidden="true" />}
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
            <h2 className="section-title">Make it. Share it. Carry it forward.</h2>
          </div>
          <p className="section-lead">The app moves from a post to a conversation, a sound, a connection and creator support.</p>
        </div>

        <div className="app-story-layout">
          <div className="app-story-stage">
            <p className="app-story-preview-label">A look inside the product</p>
            <div className="app-story-device" aria-hidden="true">
              <div className="app-story-screen">
                <header className="app-story-topbar">
                  <span className="app-story-wordmark">newFrequency</span>
                  <span className="app-story-signal" />
                </header>
                <div className="app-story-tabs">
                  {FEED_TYPES.map((format) => <span key={format} className={active.format === format ? "active" : ""}>{format}</span>)}
                </div>
                <div className={`app-story-post app-story-post-${active.scene}`} key={active.id}>
                  <StoryScene chapter={active} />
                  <div className="app-story-author"><b>nf</b><span>Creator post<br /><small>{active.kicker}</small></span></div>
                  <div className="app-story-actions"><i>♡</i><i>▢</i><i>+</i></div>
                </div>
                <div className="app-story-bottom"><i /><i /><b>+</b><i /><i /></div>
              </div>
            </div>
            <p className="app-story-caption">Illustrative interface based on the app’s feed and navigation.</p>
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
