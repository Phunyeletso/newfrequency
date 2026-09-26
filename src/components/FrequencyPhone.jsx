import { useState } from "react";

const MODES = ["Reel", "Tune", "Snap", "Chat"];
const MODE_COPY = {
  Reel: { label: "REEL · 00:18", title: "A moment in motion", detail: "Short video, made to share." },
  Tune: { label: "TUNE · ORIGINAL AUDIO", title: "A sound finds another voice", detail: "Choose a Tune as audio for a new post." },
  Snap: { label: "SNAP · PHOTO", title: "A still worth keeping", detail: "A photo post from your point of view." },
  Chat: { label: "CHAT · TEXT", title: "Say the thing", detail: "A thought can start a conversation." },
};

export default function FrequencyPhone() {
  const [mode, setMode] = useState("Reel");
  const current = MODE_COPY[mode];

  return (
    <div className="product-preview">
      <div className="preview-halo" aria-hidden="true" />
      <div className="preview-orbit orbit-one" aria-hidden="true" />
      <div className="preview-orbit orbit-two" aria-hidden="true" />
      <div className="preview-note preview-note-top" aria-hidden="true">
        <span className="mini-signal" /> Made to move around
      </div>
      <div className="phone-frame">
        <div className="phone-island" aria-hidden="true" />
        <div className="phone-header">
          <span className="phone-wordmark">new<span>Frequency</span></span>
          <span className="phone-header-mark" aria-hidden="true">⌁</span>
        </div>
        <div className="phone-tabs" role="tablist" aria-label="Preview post types">
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
        <div id="product-preview-panel" className={`phone-art phone-art-${mode.toLowerCase()}`} role="tabpanel" aria-label={`${mode} product preview`}>
          <div className="art-grain" aria-hidden="true" />
          <div className="art-ring art-ring-a" aria-hidden="true" />
          <div className="art-ring art-ring-b" aria-hidden="true" />
          <div className="art-orb" aria-hidden="true" />
          <div className="phone-art-label">{current.label}</div>
          {mode === "Tune" && <div className="mini-waveform" aria-hidden="true">{Array.from({ length: 21 }, (_, i) => <i key={i} />)}</div>}
          {mode === "Chat" && <div className="chat-sample" aria-hidden="true"><span /><span /><span /></div>}
          <p>{current.title}</p>
        </div>
        <div className="phone-post-info">
          <div className="creator-mark" aria-hidden="true">n<span>f</span></div>
          <div className="phone-copy"><strong>From a creator</strong><span>{current.detail}</span></div>
          <span className="phone-action-mark" aria-hidden="true">♡</span>
        </div>
        <div className="phone-bottom-line"><span /><span /><span /><span /></div>
      </div>
      <div className="preview-note preview-note-bottom" aria-hidden="true">
        <span className="preview-note-dot">↗</span> Reels · Tunes · Snaps · Chat
      </div>
      <p className="preview-caption">A visual preview of the newFrequency format mix.</p>
    </div>
  );
}
