"use client";

import { useEffect, useRef, useState } from "react";

type SneakerViewerProps = {
  className?: string;
  /** Which breakpoint's layout this instance renders in — only the
   * instance matching the current viewport actually loads the model, so
   * the desktop and mobile layouts don't both fetch the GLB at once. */
  variant: "desktop" | "mobile";
};

export function SneakerViewer({ className, variant }: SneakerViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1280px)");
    const update = () => {
      const isDesktop = mql.matches;
      setActive(variant === "desktop" ? isDesktop : !isDesktop);
    };
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [variant]);

  useEffect(() => {
    const el = containerRef.current;
    if (!active || !el) return;

    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        import("@google/model-viewer").then(() => {
          if (!cancelled) setReady(true);
        });
      },
      { rootMargin: "600px" }
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [active]);

  return (
    <div ref={containerRef} className={className}>
      {active && ready ? (
        <model-viewer
          src="/models/nike-air-force-1-white.glb"
          ios-src="/models/nike-air-force-1-white.usdz"
          alt="Interactive 3D model of a white Nike Air Force 1 sneaker, freshly restored by STURVY"
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          auto-rotate
          auto-rotate-delay={0}
          rotation-per-second="18deg"
          shadow-intensity="1"
          shadow-softness="0.8"
          exposure="1.05"
          camera-orbit="25deg 75deg 105%"
          field-of-view="30deg"
          loading="eager"
          reveal="auto"
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <div className="h-full w-full animate-pulse bg-soft-cloud" />
      )}
    </div>
  );
}
