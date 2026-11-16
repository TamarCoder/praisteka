"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./LandingScene.module.scss";
import type { LandingSceneProps } from "./LandingScene.types";

// 0 Board:133 — სცენის საწყისი დახრა და ზომის ფორმულა
const BASE_X = 54;
const BASE_Z = -38;
const TILT_X = 8; // ±4deg
const TILT_Z = 12; // ±6deg
const DEPTH = 90;

const sceneTransform = (dx: number, dy: number) =>
  `translateY(70px) rotateX(${BASE_X - dy * TILT_X}deg) rotateZ(${BASE_Z + dx * TILT_Z}deg)`;

// = tablet ზღვარი, _breakpoints.scss
const MOBILE_MAX = 768;

const measureScale = () => {
  const w = window.innerWidth;
  // მობილურზე სცენა ტექსტის ქვეშაა და მთელ სიგანეს იყენებს
  if (w < MOBILE_MAX) return Math.max(0.5, Math.min(0.9, (w - 48) / 440));
  return Math.max(0.5, Math.min(1.15, (window.innerHeight - 110) / 560, (w / 2 - 60) / 480));
};

export function LandingScene({ plates, tilt = true, className }: LandingSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const onResize = () => setScale(measureScale());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (!tilt || reduced || touch) return;
    const apply = (dx: number, dy: number) => {
      if (sceneRef.current) sceneRef.current.style.transform = sceneTransform(dx, dy);
    };
    const onMove = (e: MouseEvent) => apply(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
    const onLeave = (e: MouseEvent) => !e.relatedTarget && apply(0, 0);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseout", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [tilt]);

  const cls = [styles.wrap, className].filter(Boolean).join(" ");

  return (
    <div aria-hidden="true" className={cls}>
      <div className={styles.frame} style={{ transform: `scale(${scale})` }}>
        <div ref={sceneRef} className={styles.scene} style={{ transform: sceneTransform(0, 0) }}>
          {plates.map((plate, i) => (
            <div key={i} className={styles.layer} style={{ "--z": `${i * DEPTH}px` } as CSSProperties}>
              {plate}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
