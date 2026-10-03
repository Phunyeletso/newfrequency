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
      <svg className="frequency-preview-signal" viewBox="0 0 700 650" fill="none" aria-hidden="true"><path pathLength="1250" d="M350.00 235.00 L363.74 235.25 L377.45 236.01 L391.09 237.26 L404.64 239.01 L418.06 241.26 L431.32 243.99 L444.39 247.19 L457.25 250.86 L469.85 254.99 L482.18 259.56 L494.20 264.56 L505.88 269.97 L517.21 275.78 L528.15 281.97 L538.67 288.51 L548.77 295.40 L558.40 302.61 L567.56 310.12 L576.22 317.90 L584.37 325.93 L591.97 334.19 L599.03 342.65 L605.52 351.28 L611.44 360.05 L616.76 368.95 L621.49 377.94 L625.61 386.99 L629.11 396.08 L631.99 405.17 L634.25 414.25 L635.88 423.27 L636.88 432.21 L637.26 441.04 L637.01 449.74 L636.15 458.27 L634.67 466.61 L632.59 474.73 L629.90 482.60 L626.64 490.20 L622.80 497.50 L618.40 504.48 L613.45 511.10 L607.97 517.36 L601.98 523.22 L595.50 528.67 L588.54 533.69 L581.13 538.25 L573.30 542.34 L565.05 545.94 L556.42 549.04 L547.44 551.62 L538.12 553.68 L528.50 555.19 L518.60 556.15 L508.45 556.55 L498.09 556.39 L487.53 555.65 L476.81 554.34 L465.95 552.46 L455.00 550.00 L443.97 546.96 L432.91 543.35 L421.83 539.18 L410.76 534.44 L399.75 529.14 L388.81 523.30 L377.98 516.92 L367.29 510.01 L356.76 502.60 L346.42 494.69 L336.30 486.30 L326.43 477.45 L316.82 468.15 L307.51 458.43 L298.51 448.31 L289.86 437.81 L281.57 426.95 L273.66 415.77 L266.15 404.27 L259.07 392.50 L252.42 380.48 L246.22 368.23 L240.48 355.78 L235.22 343.18 L230.46 330.43 L226.19 317.58 L222.43 304.66 L219.18 291.69 L216.45 278.71 L214.25 265.75 L212.57 252.85 L211.41 240.02 L210.78 227.31 L210.67 214.74 L211.08 202.35 L212.00 190.16 L213.42 178.21 L215.34 166.52 L217.75 155.13 L220.63 144.07 L223.98 133.35 L227.78 123.01 L232.00 113.07 L236.65 103.56 L241.69 94.50 L247.11 85.91 L252.89 77.82 L259.01 70.25 L265.45 63.20 L272.18 56.71 L279.17 50.79 L286.42 45.45 L293.88 40.71 L301.53 36.57 L309.35 33.05 L317.31 30.16 L325.39 27.91 L333.54 26.29 L341.76 25.32 L350.00 25.00 L358.24 25.32 L366.46 26.29 L374.61 27.91 L382.69 30.16 L390.65 33.05 L398.47 36.57 L406.12 40.71 L413.58 45.45 L420.83 50.79 L427.82 56.71 L434.55 63.20 L440.99 70.25 L447.11 77.82 L452.89 85.91 L458.31 94.50 L463.35 103.56 L468.00 113.07 L472.22 123.01 L476.02 133.35 L479.37 144.07 L482.25 155.13 L484.66 166.52 L486.58 178.21 L488.00 190.16 L488.92 202.35 L489.33 214.74 L489.22 227.31 L488.59 240.02 L487.43 252.85 L485.75 265.75 L483.55 278.71 L480.82 291.69 L477.57 304.66 L473.81 317.58 L469.54 330.43 L464.78 343.18 L459.52 355.78 L453.78 368.23 L447.58 380.48 L440.93 392.50 L433.85 404.27 L426.34 415.77 L418.43 426.95 L410.14 437.81 L401.49 448.31 L392.49 458.43 L383.18 468.15 L373.57 477.45 L363.70 486.30 L353.58 494.69 L343.24 502.60 L332.71 510.01 L322.02 516.92 L311.19 523.30 L300.25 529.14 L289.24 534.44 L278.17 539.18 L267.09 543.35 L256.03 546.96 L245.00 550.00 L234.05 552.46 L223.19 554.34 L212.47 555.65 L201.91 556.39 L191.55 556.55 L181.40 556.15 L171.50 555.19 L161.88 553.68 L152.56 551.62 L143.58 549.04 L134.95 545.94 L126.70 542.34 L118.87 538.25 L111.46 533.69 L104.50 528.67 L98.02 523.22 L92.03 517.36 L86.55 511.10 L81.60 504.48 L77.20 497.50 L73.36 490.20 L70.10 482.60 L67.41 474.73 L65.33 466.61 L63.85 458.27 L62.99 449.74 L62.74 441.04 L63.12 432.21 L64.12 423.27 L65.75 414.25 L68.01 405.17 L70.89 396.08 L74.39 386.99 L78.51 377.94 L83.24 368.95 L88.56 360.05 L94.48 351.28 L100.97 342.65 L108.03 334.19 L115.63 325.93 L123.78 317.90 L132.44 310.12 L141.60 302.61 L151.23 295.40 L161.33 288.51 L171.85 281.97 L182.79 275.78 L194.12 269.97 L205.80 264.56 L217.82 259.56 L230.15 254.99 L242.75 250.86 L255.61 247.19 L268.68 243.99 L281.94 241.26 L295.36 239.01 L308.91 237.26 L322.55 236.01 L336.26 235.25 L350.00 235.00 Z" /></svg>
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
