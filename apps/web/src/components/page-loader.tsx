"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function PageLoader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";

    const counter = { value: 0 };
    const setCount = (value: number) => {
      if (countRef.current) countRef.current.textContent = String(Math.round(value));
    };

    const climb = gsap.to(counter, {
      value: 90,
      duration: 4,
      ease: "power1.out",
      onUpdate: () => setCount(counter.value),
    });

    const finish = () => {
      climb.kill();
      gsap.to(counter, {
        value: 100,
        duration: 0.4,
        ease: "power1.out",
        onUpdate: () => setCount(counter.value),
        onComplete: () => {
          gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.6,
            delay: 0.15,
            onComplete: () => {
              document.documentElement.style.overflow = "";
              setDone(true);
            },
          });
        },
      });
    };

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    const pageReady = new Promise<void>((resolve) => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", () => resolve(), { once: true });
      }
    });

    Promise.all([fontsReady, pageReady]).then(finish);

    return () => {
      climb.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-canvas"
    >
      <span className="sr-only">Loading STURVY…</span>
      <p
        aria-hidden="true"
        className="font-display text-[120px] uppercase leading-none tracking-wide tabular-nums text-ink sm:text-[180px] lg:text-[220px]"
      >
        <span ref={countRef}>0</span>%
      </p>
    </div>
  );
}
