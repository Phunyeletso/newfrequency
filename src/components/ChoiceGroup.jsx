/**
 * A one-tap choice row, rendered as real radio inputs so it stays keyboard
 * navigable and readable to screen readers. Shared by the feedback and
 * enquiry forms.
 */
export default function ChoiceGroup({
  legend,
  hint,
  name,
  options,
  value,
  onChange,
  invalid,
  errorId,
  error = "Please pick one.",
}) {
  return (
    <fieldset className="mb-7">
      <legend className="mb-1.5 text-base font-medium">{legend}</legend>
      {hint && <p className="mb-2.5 text-sm text-faint text-pretty">{hint}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const selected = value === o.value;
          return (
            <label
              key={o.value}
              className={`flex min-h-[48px] cursor-pointer items-center justify-center rounded-lg
                border px-5 text-base transition-colors
                ${
                  selected
                    ? "border-accent bg-accent/10 font-medium text-accent"
                    : "border-line bg-surface text-muted hover:border-faint"
                }`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={selected}
                onChange={() => onChange(o.value)}
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? errorId : undefined}
                className="sr-only"
              />
              {o.label}
              {o.hint && <span className="ml-1.5 text-sm text-faint">{o.hint}</span>}
            </label>
          );
        })}
      </div>
      {invalid && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-snaps">
          {error}
        </p>
      )}
    </fieldset>
  );
}
