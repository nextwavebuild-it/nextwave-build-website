"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageTranslator from "./LanguageTranslator";

const SHRINK_THRESHOLD = 60;

const programmes = [
  {
    number: "01",
    name: "Technology & AI",
    href: "/programmes/technology-ai",
  },
  {
    number: "02",
    name: "E-Commerce & Dropshipping",
    href: "/programmes/ecommerce-dropshipping",
  },
  {
    number: "03",
    name: "Freelancing & Online Work",
    href: "/programmes/freelancing-online-work",
  },
];

export default function Header() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [programmesOpen, setProgrammesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Prevent hover from reopening the dropdown
  // immediately after a programme link is clicked.
  const [hoverSuppressed, setHoverSuppressed] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const isProgrammePage = pathname.startsWith("/programmes/");

  /* ==========================================
     STICKY SHRINKING HEADER
  ========================================== */

  useEffect(() => {
    const updateHeader = () => {
      const shouldShrink = window.scrollY > SHRINK_THRESHOLD;

      setScrolled((previous) =>
        previous === shouldShrink ? previous : shouldShrink,
      );
    };

    window.addEventListener("scroll", updateHeader, {
      passive: true,
    });

    const frame = window.requestAnimationFrame(updateHeader);

    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  /* ==========================================
     CLOSE MENU ON OUTSIDE CLICK / ESCAPE
  ========================================== */

  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProgrammesOpen(false);
        setHoverSuppressed(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProgrammesOpen(false);
        setOpen(false);
        setHoverSuppressed(true);

        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* ==========================================
     CLOSE NAVIGATION
  ========================================== */

  function closeMenu() {
    setOpen(false);
    setProgrammesOpen(false);
    setHoverSuppressed(true);

    // Remove focus from clicked links to avoid
    // the CSS :focus-within keeping the menu open.
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  function handleDropdownLeave() {
    setProgrammesOpen(false);
    setHoverSuppressed(false);
  }

  /* ==========================================
     RENDER HEADER
  ========================================== */

  return (
    <header className={`nav${scrolled ? " nav-shrink" : ""}`}>
      <div className="shell navrow">
        {/* NEXTWAVE LOGO */}
        <Link
          href="/"
          className="brand"
          aria-label="NextWave Build home"
          onClick={closeMenu}
        >
          <Image
            src="/NextWaveBuild_Horizontal_OnDark_1200px.png"
            alt="NextWave Build"
            width={1200}
            height={300}
            priority
            sizes="(max-width: 768px) 160px, 196px"
          />
        </Link>

        {/* MAIN NAVIGATION */}
        <nav
          className={`navlinks${open ? " open" : ""}`}
          id="navlinks"
          aria-label="Main navigation"
        >
          {/* PROGRAMMES DROPDOWN */}
          <div
            ref={dropdownRef}
            className={[
              "programmes-dropdown",
              programmesOpen ? "mobile-expanded" : "",
              hoverSuppressed ? "hover-suppressed" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onPointerLeave={handleDropdownLeave}
          >
            <button
              ref={triggerRef}
              type="button"
              className={`programmes-trigger${
                isProgrammePage ? " is-active" : ""
              }`}
              aria-haspopup="true"
              aria-expanded={programmesOpen}
              aria-controls="programmes-submenu"
              onClick={() => {
                setHoverSuppressed(false);
                setProgrammesOpen((previous) => !previous);
              }}
            >
              <span>Programs</span>

              <svg
                className="programmes-chevron"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* DROPDOWN CONTENT */}
            <div id="programmes-submenu" className="programmes-dropdown-menu">
              <div className="programmes-dropdown-label">
                EXPLORE OUR PROGRAMMES
              </div>

              {programmes.map((programme) => (
                <Link
                  key={programme.number}
                  href={programme.href}
                  className={`programmes-dropdown-item${
                    pathname === programme.href ? " current" : ""
                  }`}
                  aria-current={
                    pathname === programme.href ? "page" : undefined
                  }
                  onClick={closeMenu}
                >
                  <span className="programmes-item-number">
                    {programme.number}
                  </span>

                  <span className="programmes-item-name">{programme.name}</span>

                  <span className="programmes-item-arrow" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              ))}

              {/* VIEW ALL PROGRAMMES */}
              <Link
                href="/#flagships"
                className="programmes-view-all"
                onClick={closeMenu}
              >
                VIEW ALL PROGRAMMES
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          {/* CONTACT */}
          <Link href="/#contact" onClick={closeMenu}>
            Contact
          </Link>
        </nav>

        {/* RIGHT SIDE */}
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
            onClick={() => {
              setOpen((previous) => !previous);
              setProgrammesOpen(false);
              setHoverSuppressed(false);
            }}
          >
            {open ? "×" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}
