import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({ children, className = "", delay = 0 }) {
  const element = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) return undefined;

    const bounds = element.current?.getBoundingClientRect();
    // Keep content already on screen visible while hydration completes.
    if (bounds && bounds.top < window.innerHeight - 32) return undefined;
    setVisible(false);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });
    if (element.current) observer.observe(element.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={element}
      className={`scroll-reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` }}
      onFocusCapture={() => setVisible(true)}
    >
      {children}
    </div>
  );
}
