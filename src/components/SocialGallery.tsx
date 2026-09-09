"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { socialGalleryArms } from "@/data/socialGallery";
import HoverText from "./HoverText";

/** Framer globe glyph (symbol #1715494072) — Social Gallery eyebrow. */
function GlobeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M 0 9 C 0 4.029 4.029 0 9 0 C 13.971 0 18 4.029 18 9 C 18 13.971 13.971 18 9 18 C 4.029 18 0 13.971 0 9 Z"
        transform="translate(3 3)"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 7.5 9 C 7.5 15 3.75 18 3.75 18 C 3.75 18 0 15 0 9 C 0 3 3.75 0 3.75 0 C 3.75 0 7.5 3 7.5 9 Z"
        transform="translate(8.25 3)"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 0 0 L 16.976 0"
        transform="translate(3.512 9)"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <path
        d="M 0 0 L 16.976 0"
        transform="translate(3.512 15)"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Live drag gain: ~28.8deg over 200px. */
const DEG_PER_PX = 0.144;
/** Per-frame velocity friction after release (≈60fps). */
const FRICTION = 0.92;

export default function SocialGallery() {
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);

  const applyRotation = useCallback((next: number) => {
    rotationRef.current = next;
    setRotation(next);
  }, []);

  const stopCoast = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const coast = useCallback(() => {
    stopCoast();
    const tick = () => {
      velocityRef.current *= FRICTION;
      if (Math.abs(velocityRef.current) < 0.02) {
        velocityRef.current = 0;
        rafRef.current = null;
        return;
      }
      applyRotation(rotationRef.current + velocityRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [applyRotation, stopCoast]);

  useEffect(() => () => stopCoast(), [stopCoast]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    stopCoast();
    draggingRef.current = true;
    setDragging(true);
    velocityRef.current = 0;
    lastXRef.current = e.clientX;
    lastTRef.current = performance.now();
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const now = performance.now();
    const dx = e.clientX - lastXRef.current;
    const dt = Math.max(now - lastTRef.current, 1);
    const dDeg = dx * DEG_PER_PX;
    applyRotation(rotationRef.current + dDeg);
    // deg per frame-ish for coast
    velocityRef.current = (dDeg / dt) * 16.67;
    lastXRef.current = e.clientX;
    lastTRef.current = now;
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    coast();
  };

  return (
    <section className="social-gallery" aria-labelledby="social-gallery-heading">
      <div className="social-gallery__inner">
        <header className="social-gallery__header">
          <span className="social-gallery__eyebrow">
            <span className="social-gallery__eyebrow-mark" aria-hidden="true">
              <GlobeIcon size={14} />
            </span>
            <span className="social-gallery__eyebrow-label">Stay connected</span>
          </span>

          <h2 id="social-gallery-heading" className="social-gallery__heading">
            See our community in modern silhouettes
          </h2>

          <p className="social-gallery__body">
            Connect with us on social media for a daily dose of fresh style,
            featuring exclusive looks from our community.
          </p>

          <div className="social-gallery__actions">
            <Link href="/shop" className="social-gallery__btn social-gallery__btn--solid">
              <HoverText>See collections</HoverText>
            </Link>
            <Link href="/contact" className="social-gallery__btn social-gallery__btn--ghost">
              <HoverText>Contact us</HoverText>
            </Link>
          </div>
        </header>

        <div className="social-gallery__carousel">
          <div className="social-gallery__viewport">
            <div
              className="social-gallery__stage"
              style={{
                transform: `perspective(500px) rotateY(${rotation}deg)`,
              }}
            >
              <div className="social-gallery__arms">
                {socialGalleryArms.map((arm) => (
                  <div
                    key={arm.id}
                    className="social-gallery__arm"
                    style={{ transform: `rotateY(${arm.angle}deg)` }}
                  >
                    <div className="social-gallery__face social-gallery__face--a">
                      <Image
                        src={arm.image}
                        alt={arm.alt}
                        width={260}
                        height={370}
                        className="social-gallery__image"
                        draggable={false}
                        sizes="260px"
                      />
                    </div>
                    <div className="social-gallery__face social-gallery__face--b">
                      <Image
                        src={arm.image}
                        alt=""
                        width={260}
                        height={370}
                        className="social-gallery__image"
                        draggable={false}
                        sizes="260px"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className={`social-gallery__hit${dragging ? " is-dragging" : ""}`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              role="group"
              aria-label="Community image gallery. Drag to rotate."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
