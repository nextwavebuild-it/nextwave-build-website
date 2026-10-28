"use client";

import { useState } from "react";
import LanguageTranslator from "./LanguageTranslator";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="shell navrow">
        <a href="#home" className="brand" aria-label="NextWave Build home">
          <img src="/logo-color.png" alt="" width={44} height={44} />

          <span>
            NextWave <span>Build</span>
          </span>
        </a>

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
          <a href="#flagships">Flagships</a>
          <a href="#how">The method</a>
          <a href="#why">Why NextWave</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="navend">
          {/* Sign in */}
          <a href="https://portal.nextwavebuild.com/" className="navsign">
            Sign in
          </a>

          {/* Register */}
          <a className="cta" href="https://portal.nextwavebuild.com/register">
            Register your interest <span aria-hidden="true">↗</span>
          </a>

          {/* Translator AFTER Register button */}
          <LanguageTranslator />

          {/* Mobile menu */}
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
