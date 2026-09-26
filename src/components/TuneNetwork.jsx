const NODES = [
  { label: "TUNE", sub: "An artist shares a sound", className: "network-source" },
  { label: "REEL", sub: "A creator builds a moment", className: "network-branch network-branch-a" },
  { label: "SNAP", sub: "Another post takes shape", className: "network-branch network-branch-b" },
  { label: "CHAT", sub: "A third post finds a voice", className: "network-branch network-branch-c" },
];

export default function TuneNetwork() {
  return (
    <div className="tune-network" aria-label="Diagram showing one Tune selected as audio in three creator posts">
      <svg className="network-lines" viewBox="0 0 640 420" fill="none" aria-hidden="true">
        <path d="M180 210C290 210 285 76 412 76" />
        <path d="M180 210H412" />
        <path d="M180 210C290 210 285 344 412 344" />
        <circle cx="295" cy="210" r="5" />
      </svg>
      {NODES.map((node) => (
        <div key={node.label} className={`network-node ${node.className}`}>
          <span className="network-node-kicker">{node.label === "TUNE" ? "ARTIST POST" : "CREATOR POST"}</span>
          <strong>{node.label}</strong>
          <span>{node.sub}</span>
          {node.label === "TUNE" && <div className="network-wave" aria-hidden="true">{Array.from({ length: 17 }, (_, i) => <i key={i} />)}</div>}
        </div>
      ))}
      <span className="network-caption">Same sound. New ideas.</span>
    </div>
  );
}
