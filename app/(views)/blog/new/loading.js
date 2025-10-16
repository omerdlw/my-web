"use client";

import React, { useEffect, useRef, useState } from "react";

export default function Loading() {
  const steps = 6;
  const [step, setStep] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const netEstimateMs = (() => {
      try {
        const n =
          navigator.connection ||
          navigator.mozConnection ||
          navigator.webkitConnection;
        if (n && typeof n.downlink === "number" && n.downlink > 0) {
          const mbps = n.downlink;
          const approxMs = 1200 / Math.log2(Math.max(mbps, 1) + 1);
          return Math.max(150, Math.min(5000, Math.round(approxMs)));
        }
      } catch (e) {}
      return 1500;
    })();

    const cpuEstimateMs = (() => {
      try {
        const t0 = performance.now();
        let x = 0;
        for (let i = 0; i < 120000; i++) x += i % 7;
        const dt = performance.now() - t0;
        return Math.max(20, Math.min(4000, Math.round(dt * 4)));
      } catch (e) {
        return 200;
      }
    })();

    const estimatedTotalMs = Math.max(
      400,
      Math.min(8000, Math.round(netEstimateMs + cpuEstimateMs))
    );
    const stepDuration = Math.max(80, Math.round(estimatedTotalMs / steps));

    let s = 0;
    setStep(0);
    intervalRef.current = setInterval(() => {
      s += 1;
      if (!mounted) return;
      setStep(s);
      if (s >= steps) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, stepDuration);

    return () => {
      mounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const progressFraction = Math.min(1, Math.max(0, step / steps));
  const rotateDeg = Math.round(progressFraction * 360);
  const percent = Math.round(progressFraction * 100);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Yükleniyor ${percent} %`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-black/70"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          style={{ transform: `rotate(${rotateDeg}deg)` }}
          className="h-16 w-16 rounded-full border-4 border-solid border-white/50 border-t-transparent transition-transform duration-300 ease-linear"
        ></div>
        <div className="text-sm font-semibold opacity-75">{percent}%</div>
      </div>
    </div>
  );
}
