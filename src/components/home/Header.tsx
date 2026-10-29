"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LanguageTranslator from "./LanguageTranslator";

const SHRINK_THRESHOLD = 60;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => {
      const shouldShrink = window.scrollY > SHRINK_THRESHOLD;

      setScrolled((previous) =>
        previous === shouldShrink ? previous : shouldShrink,
      );
    };

    // Scroll detection without blocking page scrolling.
    window.addEventListener("scroll", updateHeader, {
      passive: true,
    });

    // Handle refresh when the page is already scrolled.
    const frame = window.requestAnimationFrame(updateHeader);

    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className={`nav${scrolled ? " nav-shrink" : ""}`}>
      <div className="shell navrow">
        {/* NEXTWAVE LOGO */}
        <a href="#home" className="brand" aria-label="NextWave Build home">
          <Image
            src="/NextWaveBuild_Horizontal_OnDark_1200px.png"
            alt="NextWave Build"
            width={1200}
            height={300}
            priority
            sizes="(max-width: 768px) 160px, 196px"
          />
        </a>

        {/* MAIN NAVIGATION */}
        <nav
          className={`navlinks${open ? " open" : ""}`}
          id="navlinks"
          aria-label="Main navigation"
          onClick={() => setOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
            }
          }}
        >
          <a href="#flagships">Programs</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="navend">
          {/* SIGN IN / REGISTER */}
          <a className="cta" href="https://portal.nextwavebuild.com/">
            Sign in / Register
            <span aria-hidden="true">↗</span>
          </a>

          {/* LANGUAGE TRANSLATOR */}
          <LanguageTranslator />

          {/* MOBILE MENU */}
          <button
            type="button"
            className="menu"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="navlinks"
            onClick={() => setOpen((previous) => !previous)}
          >
            {open ? "×" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}
