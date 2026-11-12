"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import Image from "next/image";

type Language = "en" | "ar";

type GTranslateWindow = Window & {
  gtranslateSettings?: {
    default_language: string;
    native_language_names: boolean;
    languages: string[];
    wrapper_selector: string;
  };
  doGTranslate?: (language: string) => void;
};

const languages = [
  {
    code: "en" as const,
    name: "English",
    flag: "https://flagcdn.com/gb.svg",
  },
  {
    code: "ar" as const,
    name: "العربية",
    flag: "https://flagcdn.com/ae.svg",
  },
];

const SCRIPT_ID = "nextwave-gtranslate-script";
const SCRIPT_URL = "https://cdn.gtranslate.net/widgets/latest/float.js";

const SCRIPT_EVENT = "nextwave-gtranslate-ready";

/* ==========================================
   READ SAVED LANGUAGE
========================================== */

function getSavedLanguage(): Language {
  if (typeof document === "undefined") {
    return "en";
  }

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("googtrans="));

  return cookie?.includes("/en/ar") ? "ar" : "en";
}

function subscribeLanguage() {
  // GTranslate does not provide a reliable cookie-change
  // event. We read the cookie on hydration and manage
  // subsequent selections through React state.
  return () => {};
}

function getServerLanguage(): Language {
  return "en";
}

/* ==========================================
   GTRANSLATE SCRIPT READINESS
========================================== */

function subscribeScriptReady(callback: () => void) {
  window.addEventListener(SCRIPT_EVENT, callback);

  return () => {
    window.removeEventListener(SCRIPT_EVENT, callback);
  };
}

function getScriptReady(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const win = window as GTranslateWindow;

  const script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

  return (
    script?.dataset.loaded === "true" || typeof win.doGTranslate === "function"
  );
}

function getServerScriptReady(): boolean {
  return false;
}

/* ==========================================
   COMPONENT
========================================== */

export default function LanguageTranslator() {
  const savedLanguage = useSyncExternalStore(
    subscribeLanguage,
    getSavedLanguage,
    getServerLanguage,
  );

  const scriptReady = useSyncExternalStore(
    subscribeScriptReady,
    getScriptReady,
    getServerScriptReady,
  );

  const [manualLanguage, setManualLanguage] = useState<Language | null>(null);

  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const language = manualLanguage ?? savedLanguage;

  /* ==========================================
     INITIALIZE GTRANSLATE
  ========================================== */

  useEffect(() => {
    const win = window as GTranslateWindow;

    win.gtranslateSettings = {
      default_language: "en",
      native_language_names: true,
      languages: ["en", "ar"],
      wrapper_selector: ".gtranslate_engine",
    };

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    function handleScriptReady() {
      if (script) {
        script.dataset.loaded = "true";
      }

      window.dispatchEvent(new Event(SCRIPT_EVENT));
    }

    if (!script) {
      script = document.createElement("script");

      script.id = SCRIPT_ID;
      script.src = SCRIPT_URL;
      script.async = true;

      script.addEventListener("load", handleScriptReady);

      document.body.appendChild(script);
    } else {
      script.addEventListener("load", handleScriptReady);

      // Preserve readiness when the script already exists,
      // including after client-side navigation.
      if (
        script.dataset.loaded === "true" ||
        typeof win.doGTranslate === "function"
      ) {
        window.dispatchEvent(new Event(SCRIPT_EVENT));
      } else {
        // Existing script may have been loaded previously
        // without our readiness marker.
        // Its load event will update the status if pending.
      }
    }

    return () => {
      script?.removeEventListener("load", handleScriptReady);
    };
  }, []);

  /* ==========================================
     CLOSE DROPDOWN
  ========================================== */

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);

      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* ==========================================
     CHANGE LANGUAGE
  ========================================== */

  function changeLanguage(nextLanguage: Language) {
    setOpen(false);

    if (nextLanguage === language) {
      return;
    }

    const win = window as GTranslateWindow;

    if (typeof win.doGTranslate === "function") {
      win.doGTranslate(`en|${nextLanguage}`);

      setManualLanguage(nextLanguage);

      return;
    }

    console.warn("GTranslate is not ready. Please try again.");
  }

  const selected =
    languages.find((item) => item.code === language) ?? languages[0];

  /* ==========================================
     RENDER
  ========================================== */

  return (
    <div
      ref={containerRef}
      className="language-translator notranslate"
      translate="no"
    >
      <button
        type="button"
        className={`language-trigger${open ? " active" : ""}`}
        onClick={() => setOpen((previous) => !previous)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select website language"
        disabled={!scriptReady}
      >
        <Image
          src={selected.flag}
          alt=""
          width={26}
          height={20}
          unoptimized
          className="language-flag"
          draggable={false}
        />

        <span className="language-name">{selected.name}</span>

        <svg
          className={`language-chevron${open ? " rotated" : ""}`}
          width="16"
          height="16"
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

      {open && (
        <div
          className="language-menu"
          role="listbox"
          aria-label="Website language"
        >
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              role="option"
              aria-selected={language === item.code}
              className={`language-option${
                language === item.code ? " selected" : ""
              }`}
              onClick={() => changeLanguage(item.code)}
            >
              <Image
                src={item.flag}
                alt=""
                width={26}
                height={20}
                unoptimized
                className="language-flag"
                draggable={false}
              />

              <span className="language-name">{item.name}</span>

              {language === item.code && (
                <span className="language-check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Hidden GTranslate engine */}
      <div className="gtranslate_engine" aria-hidden="true" />
    </div>
  );
}
