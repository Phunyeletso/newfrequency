import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";

const CHAPTERS = [
  { id: "discover", kicker: "Find your people", title: <>Different vibes.<br /><em>Same frequency.</em></>, copy: "One feed. A world of people worth finding.", action: "Step inside", to: "/get-the-app", label: "Discover" },
  { id: "create", kicker: "Make your mark", title: <>Your voice.<br /><em>Your way.</em></>, copy: "Reels. Tunes. Snaps. Chats. Pick your canvas.", action: "For creators", to: "/creators", label: "Create" },
  { id: "missions", kicker: "Create with a purpose", title: <>A brand's brief.<br /><em>Your imagination.</em></>, copy: "Bring creators and brands together through Missions.", action: "Create a Mission", to: "/business/create", label: "Missions" },
  { id: "grow", kicker: "Keep the connection going", title: <>One moment.<br /><em>New connections.</em></>, copy: "Find your community. Share what comes next.", action: "Find your frequency", to: "/get-the-app", label: "Grow" },
];

function SignalMark({ className = "" }) {
  return <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 5v38M5 24h38M10.6 10.6l26.8 26.8M10.6 37.4l26.8-26.8" /></svg>;
}

function StoryScene({ chapter, compact = false }) {
  return (
    <div className={`frequency-scene frequency-scene-${chapter.id}${compact ? " frequency-scene-compact" : ""}`} aria-hidden="true">
      {chapter.id === "discover" && <>
        <img className="frequency-discover-photo" src="/media/feed-performance.webp" alt="" width="1024" height="1536" loading="lazy" />
        <div className="frequency-scene-shade" />
        <span className="frequency-scene-tag">Made of moments.</span>
        <div className="frequency-scene-caption"><span className="frequency-scene-avatar">nf</span><div><strong>Find your kind of energy.</strong><span>Reels · Tunes · Snaps · Chats</span></div></div>
        <div className="frequency-discover-sticker"><SignalMark /><span>This is<br />your space.</span></div>
      </>}
      {chapter.id === "create" && <>
        <div className="frequency-canvas-grid">
          <div className="frequency-canvas frequency-canvas-reels"><svg viewBox="0 0 32 32" fill="none"><path d="m12 8 13 8-13 8V8Z" /></svg><span>Reels</span></div>
          <div className="frequency-canvas frequency-canvas-tunes"><div className="frequency-wave">{[18, 30, 45, 24, 53, 37, 20, 47, 30].map((height, i) => <i style={{ "--wave-height": `${height}px` }} key={i} />)}</div><span>Tunes</span></div>
          <div className="frequency-canvas frequency-canvas-snaps"><svg viewBox="0 0 32 32" fill="none"><rect x="4" y="5" width="24" height="23" rx="4" /><path d="m5 23 7-7 6 6 5-5 5 5" /><circle cx="21" cy="11" r="2" /></svg><span>Snaps</span></div>
          <div className="frequency-canvas frequency-canvas-chats"><span className="frequency-chat-quote">Say it<br />your way.</span><span>Chats</span></div>
        </div>
        <span className="frequency-scene-tag">A canvas for every side of you.</span>
      </>}
      {chapter.id === "missions" && <>
        <div className="frequency-mission-orbit" />
        <div className="frequency-mission-slip"><span>MISSION WORKSPACE</span><SignalMark /><strong>The brief<br />is only<br />the beginning.</strong><div className="frequency-mission-process"><span>Brief</span><i /><span>Create</span><i /><span>Connect</span></div></div>
        <span className="frequency-scene-tag">Creators × Brands</span>
      </>}
      {chapter.id === "grow" && <>
        <svg className="frequency-community-lines" viewBox="0 0 500 560" fill="none"><circle cx="250" cy="280" r="140" /><circle cx="250" cy="280" r="220" /><path d="m250 280-140-100m140 100 130-110m-130 110-100 155m100-155 155 110m-155-110 0-190" /></svg>
        <div className="frequency-community-center"><SignalMark /><span>Your frequency</span></div>
        <div className="frequency-community-node frequency-node-one">Music</div><div className="frequency-community-node frequency-node-two">Art</div><div className="frequency-community-node frequency-node-three">Ideas</div><div className="frequency-community-node frequency-node-four">Moments</div><div className="frequency-community-node frequency-node-five">People</div>
        <span className="frequency-scene-tag">Good things travel.</span>
      </>}
    </div>
  );
}

export default function AppScrollStory() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef([]);
  const stage = useRef(null);

  useEffect(() => {
    let frame = 0;
    const updateChapter = () => {
      frame = 0;
      const viewportCenter = window.innerHeight * 0.5;
      let nearestIndex = 0;
      let nearestDistance = Infinity;
      stepRefs.current.forEach((step, index) => {
        if (!step) return;
        const bounds = step.getBoundingClientRect();
        const distance = Math.abs(bounds.top + bounds.height / 2 - viewportCenter);
        if (distance < nearestDistance) { nearestDistance = distance; nearestIndex = index; }
      });
      setActiveIndex((current) => current === nearestIndex ? current : nearestIndex);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(updateChapter); };
    // Only subscribe to scrolling while the story is near the viewport.
    let observer;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { window.addEventListener("scroll", schedule, { passive: true }); schedule(); }
        else window.removeEventListener("scroll", schedule);
      }, { rootMargin: "200px" });
      if (stage.current) observer.observe(stage.current);
    } else window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();
    return () => { observer?.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); if (frame) window.cancelAnimationFrame(frame); };
  }, []);

  return (
    <section className="frequency-chapters" id="product" ref={stage} aria-labelledby="frequency-chapters-title">
      <div className="page-container">
        <ScrollReveal><div className="frequency-chapters-heading"><p className="section-kicker">Life, on your frequency</p><h2 id="frequency-chapters-title">It starts with <em>you.</em></h2><span>Then it goes somewhere new.</span></div></ScrollReveal>
        <div className="frequency-chapters-layout">
          <div className="frequency-sticky-stage">
            <div className="frequency-stage-scenes">{CHAPTERS.map((chapter, index) => <div className={`frequency-stage-layer ${index === activeIndex ? "is-active" : ""}`} key={chapter.id}><StoryScene chapter={chapter} /></div>)}</div>
            <nav className="frequency-chapter-nav" aria-label="Story chapters">{CHAPTERS.map((chapter, index) => <a href={`#frequency-${chapter.id}`} key={chapter.id} aria-current={index === activeIndex ? "step" : undefined}><span>{String(index + 1).padStart(2, "0")}</span>{chapter.label}</a>)}</nav>
            <p className="frequency-scene-note">A glimpse of the newFrequency experience</p>
          </div>
          <div className="frequency-chapter-steps">
            {CHAPTERS.map((chapter, index) => <article className={`frequency-chapter ${activeIndex === index ? "is-active" : ""}`} id={`frequency-${chapter.id}`} key={chapter.id} ref={(node) => { stepRefs.current[index] = node; }}>
              <p className="frequency-chapter-kicker"><span>{String(index + 1).padStart(2, "0")}</span>{chapter.kicker}</p>
              <h3>{chapter.title}</h3><p className="frequency-chapter-copy">{chapter.copy}</p>
              <Link className="frequency-chapter-link" to={chapter.to}>{chapter.action}<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg></Link>
              <div className="frequency-mobile-scene"><StoryScene chapter={chapter} compact /></div>
            </article>)}
          </div>
        </div>
      </div>
    </section>
  );
}
