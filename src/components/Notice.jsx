/**
 * A plainly-worded honesty note. Used to set expectations about the test
 * build — never to make a promise.
 */
export default function Notice({ children, className = "" }) {
  return (
    <div
      className={`rounded-lg border border-line bg-surface px-4 py-3 text-sm text-muted text-pretty ${className}`}
    >
      {children}
    </div>
  );
}
