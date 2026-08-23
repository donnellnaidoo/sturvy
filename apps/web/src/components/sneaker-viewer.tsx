"use client";

import { useEffect, useState } from "react";

export function SneakerViewer({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    import("@google/model-viewer").then(() => setReady(true));
  }, []);

  return (
    <div className={className}>
      {ready ? (
        <model-viewer
          src="/models/nike-air-force-1-white.glb"
          ios-src="/models/nike-air-force-1-white.usdz"
          alt="Interactive 3D model of a white Nike Air Force 1 sneaker, freshly restored by KleenKicks"
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
