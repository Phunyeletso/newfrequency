function FeedActions() {
  return <div className="phone-feed-actions" aria-hidden="true">
    <span><svg viewBox="0 0 24 24"><path d="M20.8 8.8c0 5.4-8.8 11-8.8 11s-8.8-5.6-8.8-11A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.6Z" /></svg></span>
    <span><svg viewBox="0 0 24 24"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20l1.1-4.1A8.5 8.5 0 1 1 20.5 11.5Z" /></svg></span>
    <span><svg viewBox="0 0 24 24"><path d="m21 3-7.2 18-3.7-7.1L3 10.2 21 3Zm-10.9 10.9 5.2-5.2" /></svg></span>
    <span><svg viewBox="0 0 24 24"><path d="M12 8v13M4 12h16v9H4zM2.5 8h19v4h-19zM12 8c-4.5 0-6.3-1.3-6.3-3.1A2.1 2.1 0 0 1 7.9 2.8C10 2.8 12 8 12 8Zm0 0c4.5 0 6.3-1.3 6.3-3.1a2.1 2.1 0 0 0-2.2-2.1C14 2.8 12 8 12 8Z" /></svg></span>
  </div>;
}

function BottomNavigation() {
  return <div className="phone-bottom-nav" aria-hidden="true"><span><i className="nav-home" />Home</span><span><i className="nav-collection" />Explore</span><span className="nav-create"><i>+</i><small>Create</small></span><span><i className="nav-notifications" />Inbox</span><span><i className="nav-profile" />Profile</span></div>;
}

export default function FrequencyPhone() {
  return (
    <div className="frequency-preview" aria-label="Illustrative Reels screen preview">
      <div className="frequency-preview-orbit" aria-hidden="true" />
      <svg className="frequency-preview-signal" viewBox="0 0 650 650" fill="none" aria-hidden="true"><path d="M-50 430c110-65 180-340 265-175s95 130 165-55 135-90 310-70" /><path d="M-60 475c155-75 174-318 274-160s87 110 175-55 135-120 310-77" /></svg>
      <div className="phone-frame frequency-preview-device">
        <div className="phone-island" aria-hidden="true" />
        <div className="phone-statusbar" aria-hidden="true"><span>newFrequency</span><svg viewBox="0 0 28 12" fill="none"><path d="M2 10V8m4 2V5m4 5V2m5 1h9v7h-9zm11 3v2" /></svg></div>
        <div className="phone-art phone-art-reels frequency-format-panel">
          <img className="phone-feed-photo" src="/media/feed-performance.webp" alt="A singer sharing a moment on a green-lit stage" width="1024" height="1536" />
          <div className="phone-feed-tint" aria-hidden="true" />
          <span className="phone-art-label" aria-hidden="true">REELS</span>
          <FeedActions />
          <div className="phone-art-copy"><span className="phone-creator-name">newFrequency</span><p>A moment worth sharing.</p><small>Short videos. Your perspective.</small></div>
        </div>
        <BottomNavigation />
      </div>
    </div>
  );
}
