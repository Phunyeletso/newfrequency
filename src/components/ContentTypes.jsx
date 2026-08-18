import { CONTENT_TYPES } from "../lib/config";

// The four identity colours appear ONLY here, where the types are named.
const dot = {
  reels: "bg-reels",
  tunes: "bg-tunes",
  snaps: "bg-snaps",
  chats: "bg-chats",
};

export default function ContentTypes() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {CONTENT_TYPES.map((t) => (
        <li
          key={t.name}
          className="rounded-xl border border-line bg-surface p-5"
        >
          <h3 className="mb-1.5 flex items-center gap-2.5 text-lg">
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot[t.color]}`}
              aria-hidden="true"
            />
            {t.name}
          </h3>
          <p className="text-sm text-muted text-pretty">{t.desc}</p>
        </li>
      ))}
    </ul>
  );
}
