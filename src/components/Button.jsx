import { Link } from "react-router-dom";

const styles = {
  primary:
    "bg-accent text-ground hover:bg-accent-dim active:bg-accent-dim font-semibold",
  secondary:
    "bg-raised text-ink border border-line hover:border-faint font-medium",
};

/** Renders a Link, an <a>, or a <button> depending on the props given. */
export default function Button({
  to,
  href,
  variant = "primary",
  className = "",
  children,
  ...rest
}) {
  const base = `inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3
    text-base leading-none transition-colors min-h-[48px] ${styles[variant]} ${className}`;

  if (to) return <Link to={to} className={base} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={base} {...rest}>{children}</a>;
  return <button className={base} {...rest}>{children}</button>;
}
