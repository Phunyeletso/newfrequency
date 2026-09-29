import { useState } from "react";

const MODES = ["Reels", "Tunes", "Snaps", "Chats"];
const MODE_COPY = {
  Reels: { label: "REELS", title: "Different vibes. Same frequency.", detail: "Short video" },
  Tunes: { label: "TUNES", title: "Choose a Tune as audio for a new post.", detail: "Original audio" },
  Snaps: { label: "SNAPS", title: "Post videos, pictures and quotes your way.", detail: "Photo posts" },
  Chats: { label: "CHATS", title: "Post videos, pictures and quotes your way.", detail: "Text posts" },
};

function FeedActions() {
  return (
    <div className="phone-feed-actions" aria-hidden="true">
      <span><svg viewBox="0 0 24 24"><path d="M20.8 8.8c0 5.4-8.8 11-8.8 11s-8.8-5.6-8.8-11A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.6Z" /></svg></span>
      <span><svg viewBox="0 0 24 24"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20l1.1-4.1A8.5 8.5 0 1 1 20.5 11.5Z" /></svg></span>
      <span><svg viewBox="0 0 24 24"><path d="m21 3-7.2 18-3.7-7.1L3 10.2 21 3Z" /><path d="m10.1 13.9 5.2-5.2" /></svg></span>
      <span><svg viewBox="0 0 24 24"><path d="M12 8v13M4 12h16v9H4zM2.5 8h19v4h-19z" /><path d="M12 8c-4.5 0-6.3-1.3-6.3-3.1A2.1 2.1 0 0 1 7.9 2.8C10 2.8 12 8 12 8Zm0 0c4.5 0 6.3-1.3 6.3-3.1a2.1 2.1 0 0 0-2.2-2.1C14 2.8 12 8 12 8Z" /></svg></span>
    </div>
  );
}

function BottomNavigation() {
  return (
    <div className="phone-bottom-nav" aria-label="App navigation preview" aria-hidden="true">
      <span><i className="nav-home" />Home</span>
      <span><i className="nav-collection" />Explore</span>
      <span className="nav-create"><i>+</i><small>Create</small></span>
      <span><i className="nav-notifications" />Inbox</span>
      <span><i className="nav-profile" />Profile</span>
    </div>
  );
}

export default function FrequencyPhone() {
  const [mode, setMode] = useState("Reels");
  const current = MODE_COPY[mode];

  return (
    <div className="product-preview">
      <div className="preview-halo" aria-hidden="true" />
      <svg className="preview-ribbon" viewBox="0 0 640 700" fill="none" aria-hidden="true">
        <path d="M-20 366C115 215 137 553 268 382S422 162 665 295" />
        <path d="M-16 463C130 313 160 640 300 460S449 240 665 370" />
      </svg>
      <div className="preview-orbit orbit-one" aria-hidden="true" />
      <div className="preview-orbit orbit-two" aria-hidden="true" />
      <div className="phone-frame">
        <div className="phone-island" aria-hidden="true" />
        <div className="phone-statusbar" aria-hidden="true"><span>newFrequency</span><span className="phone-status-icons">● ◒ ▰</span></div>
        <div className="phone-main-nav">
          <span className="phone-live" title="Live streaming is in pre-release">LIVE <i>PRE-RELEASE</i></span>
          <div className="phone-tabs" role="tablist" aria-label="Choose a feed format">
            {MODES.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={mode === item}
                aria-controls="product-preview-panel"
                onClick={() => setMode(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.6" /><path d="m16 16 5 5" /></svg>
        </div>
        <div id="product-preview-panel" className={`phone-art phone-art-${mode.toLowerCase()}`} role="tabpanel" aria-label={`${mode} feed preview`}>
          <img className="phone-feed-photo" src="/media/feed-performance.webp" alt="" />
          <div className="phone-feed-tint" aria-hidden="true" />
          <div className="phone-light-lines" aria-hidden="true"><i /><i /><i /></div>
          <span className="phone-art-label">{current.label}</span>
          {mode === "Tunes" && <div className="mini-waveform" aria-hidden="true">{Array.from({ length: 25 }, (_, i) => <i key={i} />)}</div>}
          {mode === "Chats" && <div className="phone-chat-art" aria-hidden="true"><i /><i /><i /></div>}
          <FeedActions />
          <div className="phone-art-copy" key={mode}>
            <span className="phone-creator-name">newFrequency <b>✓</b></span>
            <p>{current.title}</p>
            <small>{current.detail}</small>
          </div>
        </div>
        <BottomNavigation />
      </div>
    </div>
  );
}
