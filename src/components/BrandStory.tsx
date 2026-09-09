"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { assets } from "@/data/assets";
import HoverText from "./HoverText";

const BODY =
  "A decade ago, we set out to redefine the modern silhouette. Today, we merge urban utility with high-end aesthetics in a resilient, beautiful collection.";

/** Framer symbol #1411738543 — pause bars (playing state). */
function PauseIcon() {
  return (
    <svg
      className="brand-story__control-icon"
      viewBox="0 0 24 24"
      width={20}
      height={20}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="#000" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M 0.75 16.5 C 0.336 16.5 0 16.164 0 15.75 L 0 0.75 C 0 0.336 0.336 0 0.75 0 L 4.5 0 C 4.914 0 5.25 0.336 5.25 0.75 L 5.25 15.75 C 5.25 16.164 4.914 16.5 4.5 16.5 Z"
          transform="translate(4.5 3.75)"
        />
        <path
          d="M 0.75 16.5 C 0.336 16.5 0 16.164 0 15.75 L 0 0.75 C 0 0.336 0.336 0 0.75 0 L 4.5 0 C 4.914 0 5.25 0.336 5.25 0.75 L 5.25 15.75 C 5.25 16.164 4.914 16.5 4.5 16.5 Z"
          transform="translate(14.25 3.75)"
        />
      </g>
    </svg>
  );
}

/** Framer symbol #3492944464 — play triangle (paused state). */
function PlayIcon() {
  return (
    <svg
      className="brand-story__control-icon"
      viewBox="0 0 24 24"
      width={20}
      height={20}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M 0 0.736 L 0 17.259 C 0.005 17.527 0.153 17.772 0.388 17.902 C 0.623 18.031 0.91 18.025 1.139 17.886 L 14.647 9.625 C 14.866 9.492 15 9.254 15 8.997 C 15 8.741 14.866 8.503 14.647 8.37 L 1.139 0.109 C 0.91 -0.03 0.623 -0.036 0.388 0.093 C 0.153 0.222 0.005 0.468 0 0.736 Z"
        transform="translate(6.75 3.003)"
        fill="#000"
        stroke="#000"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BrandStory() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      userPausedRef.current = true;
      video.pause();
      video.removeAttribute("autoplay");
      setPlaying(false);
      return;
    }

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!userPausedRef.current) {
            void video.play().catch(() => {
              userPausedRef.current = true;
              setPlaying(false);
            });
          }
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      userPausedRef.current = false;
      void video.play().catch(() => {
        userPausedRef.current = true;
        setPlaying(false);
      });
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  }, []);

  return (
    <section className="brand-story" aria-labelledby="brand-story-heading">
      <div className="brand-story__media" aria-hidden="true">
        <video
          ref={videoRef}
          className="brand-story__video"
          src={assets.brandStory.video}
          poster={assets.brandStory.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="brand-story__overlay" />
      </div>

      <div className="brand-story__control-bar">
        <button
          type="button"
          className="brand-story__control"
          aria-label={playing ? "Pause" : "Play"}
          onClick={togglePlayback}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      <div className="brand-story__container">
        <div className="brand-story__content">
          <div className="brand-story__tags" aria-label="Brand">
            <span className="brand-story__tag">Wearix</span>
            <span className="brand-story__tag brand-story__tag--plain">
              Since 2014
            </span>
          </div>

          <div className="brand-story__copy">
            <h2 id="brand-story-heading" className="brand-story__heading">
              Defining modern style
            </h2>
            <p className="brand-story__text">{BODY}</p>
          </div>

          <div className="brand-story__actions">
            <Link href="/about" className="brand-story__btn brand-story__btn--solid">
              <HoverText>More about us</HoverText>
            </Link>
            <Link href="/contact" className="brand-story__btn brand-story__btn--glass">
              <HoverText>Contact us</HoverText>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
