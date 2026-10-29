"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";

const SLIDE_INTERVAL = 3000;

const slides = [
  {
    title: "E-COMMERCE",
    src: "/assets/ECOMMERCE.webp",
    alt: "Illustration of an online store",
    lines: ["E-COMMERCE", "& DROPSHIPPING"],
  },
  {
    title: "FREELANCING",
    src: "/assets/FREELANCER.webp",
    alt: "Illustration of a freelance portfolio",
    lines: ["FREELANCING", "& ONLINE WORK"],
  },
  {
    title: "TECHNOLOGY & AI",
    src: "/assets/AI.webp",
    alt: "Illustration of technology and AI learning",
    lines: ["TECHNOLOGY", "& AI"],
  },
];

const subscribeToReducedMotion = (callback: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");

  media.addEventListener("change", callback);

  return () => media.removeEventListener("change", callback);
};

const getReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const getServerReducedMotion = () => false;

export default function Hero() {
  const [current, setCurrent] = useState(2);
  const [resetCount, setResetCount] = useState(0);

  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );

  const goToSlide = useCallback((index: number) => {
    setCurrent(((index % slides.length) + slides.length) % slides.length);

    setResetCount((count) => count + 1);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);

    return () => window.clearTimeout(timer);
  }, [current, resetCount]);

  const slide = slides[current];

  return (
    <section
      className="film hero-compact"
      id="home"
      aria-label="NextWave Build featured programmes"
    >
      <div className="film-glow" aria-hidden="true" />

      <div className="shell film-body">
        <div className="hero-copy">
          <div className="eyebrow">Join the NextWave of earning online</div>

          <h1>
            Don&apos;t just
            <br />
            <span className="outline">learn it.</span>
            <br />
            <span className="acid hero-build-animated">Build it.</span>
          </h1>

          <p>
            Go beyond watching lessons. Learn practical skills, practise them,
            and bring your ideas to life through real projects—with guidance
            along the way.
          </p>
        </div>

        <div className="film-art">
          <div className="back-circle" aria-hidden="true" />

          <div className="bigtype" aria-hidden="true">
            N
          </div>

          <div className="spotlight">
            <Image
              key={current}
              className={`hero-slide-image${
                reducedMotion ? " no-slide-motion" : ""
              }`}
              src={slide.src}
              alt={slide.alt}
              width={720}
              height={720}
              priority={current === 2}
              sizes="(max-width: 768px) 92vw, (max-width: 1200px) 50vw, 650px"
              style={{
                objectFit: "contain",
              }}
            />
          </div>

          <div className="livebadge">YOUR NEXT CHAPTER / 00{current + 1}</div>

          <div className="plate">
            <span>FEATURED PATH</span>

            <strong
              key={current}
              className={`hero-slide-heading${
                reducedMotion ? " no-slide-motion" : ""
              }`}
              aria-live="off"
            >
              {slide.lines.map((line) => (
                <span className="hero-label-line" key={line}>
                  {line}
                </span>
              ))}
            </strong>
          </div>
        </div>
      </div>

      <div className="slidesbar" aria-label="Featured programme navigation">
        <div className="shell slidesrow">
          {slides.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className={`slide-tab${index === current ? " active" : ""}`}
              aria-pressed={index === current}
              onClick={() => goToSlide(index)}
            >
              <i>{String(index + 1).padStart(2, "0")}</i>

              {item.title}
            </button>
          ))}

          <div className="slide-arrows">
            <button
              type="button"
              onClick={() => goToSlide(current - 1)}
              aria-label="Previous featured programmes"
            >
              ←
            </button>

            <button
              type="button"
              onClick={() => goToSlide(current + 1)}
              aria-label="Next featured programmes"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
