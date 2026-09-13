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
/** Slow continuous auto-spin (deg per ms ≈ 0.12deg/frame @60fps). */
const AUTO_DEG_PER_MS = 0.12 / 16.67;
/** Hover slows auto-spin without stopping it. */
const HOVER_SPEED_FACTOR = 0.35;
const COAST_STOP = 0.02;

type MotionMode = "auto" | "drag" | "coast";

export default function SocialGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const modeRef = useRef<MotionMode>("auto");
  const visibleRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const pointerInsideRef = useRef(false);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);
  const lastFrameTRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const readScale = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return 1;
    const raw = getComputedStyle(el).getPropertyValue("--sg-scale").trim();
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }, []);

  const applyRotation = useCallback((next: number) => {
    rotationRef.current = next;
    const stage = stageRef.current;
    if (stage) {
      stage.style.transform = `perspective(500px) rotateY(${next}deg)`;
    }
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastFrameTRef.current = 0;
  }, []);

  const shouldRun = useCallback(() => {
    if (reducedMotionRef.current) return false;
    if (!visibleRef.current) return false;
    return true;
  }, []);

  const tick = useCallback(
    (now: number) => {
      if (!shouldRun() && modeRef.current !== "drag") {
        // Keep coasting only while visible; otherwise freeze.
        if (!visibleRef.current || reducedMotionRef.current) {
          if (modeRef.current === "coast") {
            velocityRef.current = 0;
            modeRef.current = "auto";
          }
          rafRef.current = null;
          lastFrameTRef.current = 0;
          return;
        }
      }

      const prev = lastFrameTRef.current || now;
      const dt = Math.min(Math.max(now - prev, 0), 48);
      lastFrameTRef.current = now;

      if (modeRef.current === "drag") {
        // Manual control — wait for pointer events.
      } else if (modeRef.current === "coast") {
        velocityRef.current *= FRICTION;
        if (Math.abs(velocityRef.current) < COAST_STOP) {
          velocityRef.current = 0;
          modeRef.current = "auto";
        } else {
          applyRotation(rotationRef.current + velocityRef.current);
        }
      } else if (
        modeRef.current === "auto" &&
        visibleRef.current &&
        !reducedMotionRef.current
      ) {
        const factor = pointerInsideRef.current ? HOVER_SPEED_FACTOR : 1;
        applyRotation(
          rotationRef.current + AUTO_DEG_PER_MS * dt * factor,
        );
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [applyRotation, shouldRun],
  );

  const ensureLoop = useCallback(() => {
    if (rafRef.current != null) return;
    if (reducedMotionRef.current && modeRef.current !== "drag") return;
    if (!visibleRef.current && modeRef.current !== "drag") return;
    lastFrameTRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    applyRotation(rotationRef.current);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReduced = () => {
      reducedMotionRef.current = mq.matches;
      if (mq.matches) {
        velocityRef.current = 0;
        modeRef.current = "auto";
        stopLoop();
      } else if (visibleRef.current) {
        ensureLoop();
      }
    };
    syncReduced();
    mq.addEventListener("change", syncReduced);

    const section = sectionRef.current;
    let observer: IntersectionObserver | null = null;
    if (section) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          // Treat any meaningful visibility as active; threshold alone can miss tall sections.
          const ratio = entry?.intersectionRatio ?? 0;
          const visible =
            !!entry?.isIntersecting || ratio > 0.05;
          visibleRef.current = visible;
          if (visible) {
            ensureLoop();
          } else {
            // Pause off-screen; keep rotation angle.
            if (modeRef.current !== "drag") {
              velocityRef.current = 0;
              if (modeRef.current === "coast") modeRef.current = "auto";
              stopLoop();
            }
          }
        },
        { threshold: [0, 0.05, 0.12, 0.25, 0.5, 0.75, 1], rootMargin: "0px" },
      );
      observer.observe(section);
    }

    // Fallback: if already in view before observer callback, start immediately.
    const rect = section?.getBoundingClientRect();
    if (rect) {
      const vh = window.innerHeight || 0;
      const visiblePx = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      if (visiblePx / Math.max(rect.height, 1) > 0.05) {
        visibleRef.current = true;
        ensureLoop();
      }
    }

    return () => {
      mq.removeEventListener("change", syncReduced);
      observer?.disconnect();
      stopLoop();
    };
  }, [applyRotation, ensureLoop, stopLoop]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    draggingRef.current = true;
    modeRef.current = "drag";
    velocityRef.current = 0;
    setDragging(true);
    lastXRef.current = e.clientX;
    lastTRef.current = performance.now();
    e.currentTarget.setPointerCapture(e.pointerId);
    // Drag applies rotation from pointer events; only keep the loop for coast/auto.
    if (!reducedMotionRef.current) ensureLoop();
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const now = performance.now();
    const dx = e.clientX - lastXRef.current;
    const dt = Math.max(now - lastTRef.current, 1);
    // Compensate CSS --sg-scale so visual drag feel stays consistent when scaled.
    const dDeg = (dx * DEG_PER_PX) / readScale();
    applyRotation(rotationRef.current + dDeg);
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

    if (reducedMotionRef.current) {
      velocityRef.current = 0;
      modeRef.current = "auto";
      stopLoop();
      return;
    }

    if (Math.abs(velocityRef.current) >= COAST_STOP) {
      modeRef.current = "coast";
    } else {
      velocityRef.current = 0;
      modeRef.current = "auto";
    }
    ensureLoop();
  };

  const onPointerEnter = () => {
    pointerInsideRef.current = true;
  };

  const onPointerLeave = () => {
    pointerInsideRef.current = false;
  };

  return (
    <section
      ref={sectionRef}
      className="social-gallery"
      aria-labelledby="social-gallery-heading"
    >
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

        <div ref={carouselRef} className="social-gallery__carousel">
          <div className="social-gallery__viewport">
            <div ref={stageRef} className="social-gallery__stage">
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
                        sizes="(max-width: 809px) 140px, (max-width: 1199px) 200px, 260px"
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
                        sizes="(max-width: 809px) 140px, (max-width: 1199px) 200px, 260px"
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
              onPointerEnter={onPointerEnter}
              onPointerLeave={onPointerLeave}
              role="group"
              aria-label="Community image gallery. Drag to rotate."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
