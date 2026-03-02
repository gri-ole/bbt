"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function GsapEntrance({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // Baseline must remain visible even if GSAP fails.
    try {
      gsap.fromTo(
        el,
        { opacity: 0, y: 10, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power2.out" }
      );
    } catch {
      // no-op
    }
  }, []);

  return <div ref={ref}>{children}</div>;
}





