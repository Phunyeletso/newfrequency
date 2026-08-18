/** A page section with a real <h2> and consistent rhythm. */
export default function Section({ title, lead, children, className = "", id }) {
  return (
    <section id={id} className={`px-5 py-14 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-content">
        {title && (
          <h2 className="text-2xl sm:text-3xl mb-3">{title}</h2>
        )}
        {lead && (
          <p className="text-muted text-base sm:text-lg max-w-prose mb-8 text-pretty">
            {lead}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
