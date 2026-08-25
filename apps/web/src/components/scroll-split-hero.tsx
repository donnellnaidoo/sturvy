"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whatsappHref } from "@/lib/site-config";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HERO_VIDEO_SRC = "/videos/interpolated-2x-kleenkicks-hero-split.mp4";

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
      video.src = HERO_VIDEO_SRC;
      video.pause();
      return;
    }

    if (coarsePointer) {
      video.src = HERO_VIDEO_SRC;
      video.loop = true;
      video.play().catch(() => {});
      return;
    }

    video.pause();

    let tween: gsap.core.Tween | undefined;
    let cancelled = false;
    let objectUrl: string | undefined;

    const start = () => {
      tween = gsap.to(video, {
        currentTime: video.duration,
        ease: "none",
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });
    };

    const armWhenReady = () => {
      if (video.readyState >= 1) {
        start();
      } else {
        video.addEventListener("loadedmetadata", start, { once: true });
      }
    };

    // Scrubbing seeks around the whole clip as the user scrolls. If the
    // video is still streaming, seeking ahead of the buffered range stalls
    // playback until that chunk downloads — which reads as the scrub being
    // "stuck". Pull the whole file into memory first so every seek during
    // scroll resolves instantly, with no network dependency.
    fetch(HERO_VIDEO_SRC)
      .then((res) => res.blob())
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        video.src = objectUrl;
        armWhenReady();
      })
      .catch(() => {
        if (cancelled) return;
        video.src = HERO_VIDEO_SRC;
        armWhenReady();
      });

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", start);
      tween?.scrollTrigger?.kill();
      tween?.kill();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  return (
    <section
      ref={trackRef}
      className="relative h-[130vh] sm:h-[170vh] lg:h-[240vh] [@media(pointer:coarse)]:h-auto"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-soft-cloud [@media(pointer:coarse)]:relative [@media(pointer:coarse)]:h-[100dvh]">
        <video
          ref={videoRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
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
                href={whatsappHref("Hi STURVY! I'd like to book a sneaker clean.")}
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
