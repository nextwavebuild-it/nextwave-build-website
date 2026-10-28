"use client";

import { useEffect, useRef, useState } from "react";

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

export default function LanguageTranslator() {
  const [language, setLanguage] = useState<Language>("en");
  const [open, setOpen] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const win = window as GTranslateWindow;

    win.gtranslateSettings = {
      default_language: "en",
      native_language_names: true,
      languages: ["en", "ar"],
      wrapper_selector: ".gtranslate_engine",
    };

    // Detect previously selected language.
    const cookie = document.cookie
      .split("; ")
      .find((item) => item.startsWith("googtrans="));

    if (cookie?.includes("/en/ar")) {
      setLanguage("ar");
    }

    function handleScriptReady() {
      setScriptReady(true);
    }

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
      script.async = true;
      script.addEventListener("load", handleScriptReady);
      document.body.appendChild(script);
    } else {
      setScriptReady(true);
    }

    return () => {
      script?.removeEventListener("load", handleScriptReady);
    };
  }, []);

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

  function changeLanguage(nextLanguage: Language) {
    setOpen(false);

    if (nextLanguage === language) return;

    const win = window as GTranslateWindow;

    if (typeof win.doGTranslate === "function") {
      win.doGTranslate(`en|${nextLanguage}`);
      setLanguage(nextLanguage);
      return;
    }

    console.warn("GTranslate is not ready. Please try again.");
  }

  const selected =
    languages.find((item) => item.code === language) ?? languages[0];

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
        <img
          src={selected.flag}
          alt=""
          width={26}
          height={20}
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
              <img
                src={item.flag}
                alt=""
                width={26}
                height={20}
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

      {/* Hidden GTranslate translation engine */}
      <div className="gtranslate_engine" aria-hidden="true" />
    </div>
  );
}
