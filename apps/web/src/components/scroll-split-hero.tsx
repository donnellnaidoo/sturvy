"use client";

import { useEffect, useRef } from "react";
import { whatsappHref } from "@/lib/site-config";

export function ScrollSplitHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const track = trackRef.current;
    if (!video || !track) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (reduceMotion) {
      video.pause();
      return;
    }

    if (coarsePointer) {
      video.loop = true;
      video.play().catch(() => {});
      return;
    }

    let rafId = 0;
    let ticking = false;

    const scrub = () => {
      ticking = false;
      const duration = video.duration;
      if (!duration) return;
      const rect = track.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.min(1, Math.max(0, total > 0 ? scrolled / total : 0));
      video.currentTime = progress * duration;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(scrub);
      }
    };

    video.pause();
    if (video.readyState >= 1) {
      scrub();
    } else {
      video.addEventListener("loadedmetadata", scrub, { once: true });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section ref={trackRef} className="relative h-[130vh] sm:h-[170vh] lg:h-[240vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-soft-cloud">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/kleenkicks-hero-split.mp4"
          poster="/videos/kleenkicks-hero-poster.jpg"
          muted
          playsInline
          preload="auto"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.75) 30%, rgba(255,255,255,0) 60%), linear-gradient(to top, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0) 55%)",
          }}
        />

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="mx-auto w-full max-w-[1440px] px-6 pb-24 sm:pb-32 lg:pb-40">
            <p className="text-sm font-medium text-mute">
              Sneaker Cleaning Studio · Benoni, Ekurhuleni, Gauteng
            </p>
            <h1 className="mt-3 max-w-2xl font-display text-[56px] uppercase leading-[0.9] tracking-wide text-ink sm:text-[76px] lg:text-[96px]">
              Restored.
              <br />
              Not Replaced.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-charcoal">
              Every layer, properly cleaned. Deep cleans, sole restoration, and
              crease-free finishes — with free pickup across Ekurhuleni and
              Johannesburg.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={whatsappHref("Hi KleenKicks! I'd like to book a sneaker clean.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center rounded-full bg-ink px-8 text-base font-medium text-on-ink"
              >
                Book a Clean
              </a>
              <a
                href="#pricing"
                className="flex h-12 items-center rounded-full bg-canvas px-8 text-base font-medium text-ink"
              >
                See Pricing
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
