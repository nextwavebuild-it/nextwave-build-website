"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import "./leads.css";

const programmes = [
  {
    number: "01",
    title: "Technology & AI",
    description:
      "Explore AI tools, modern technologies, and practical applications.",
  },
  {
    number: "02",
    title: "E-Commerce",
    description:
      "Learn to build and manage an online business through practical projects.",
  },
  {
    number: "03",
    title: "Freelancing",
    description: "Develop digital skills and learn how to work with clients.",
  },
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  programme: "",
  consent: false,
};

export default function LeadsPage() {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);

  const submittingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up any pending timeout if the page unmounts.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Prevent duplicate submissions.
    if (submittingRef.current) return;

    submittingRef.current = true;
    setIsSubmitting(true);

    // Demo only: simulate a 2-second submission.
    // No data is transmitted or stored.
    timeoutRef.current = setTimeout(() => {
      setForm({ ...initialForm });
      setIsSubmitting(false);
      submittingRef.current = false;
      timeoutRef.current = null;
      setSuccess(true);
    }, 2000);
  }

  function closeSuccess() {
    setSuccess(false);
  }

  return (
    <main className="leads-page">
      {/* HEADER */}
      <header className="leads-header">
        <div className="leads-container leads-nav">
          <Link href="/" className="leads-logo">
            NEXTWAVE <span>BUILD.</span>
          </Link>

          <a href="#lead-form" className="leads-nav-button">
            Get Started
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="leads-hero">
        <div className="leads-container leads-hero-grid">
          {/* LEFT CONTENT */}
          <div className="leads-hero-content">
            <span className="leads-eyebrow">
              <span className="leads-status-dot" />
              Your Future Starts Here
            </span>

            <h1 className="leads-heading">
              Don&apos;t Just
              <br />
              Learn It.
              <br />
              <span className="leads-accent">Build It.</span>
            </h1>

            <p className="leads-description">
              Transform your ambitions into practical skills with NextWave
              Build. Explore our 12-week programmes in Technology &amp; AI,
              E-Commerce, and Freelancing, with live mentor guidance and
              hands-on projects.
            </p>

            <a
              href="#lead-form"
              className="leads-primary-button leads-hero-cta"
            >
              Explore Your Opportunities ↗
            </a>

            {/* HIGHLIGHTS */}
            <div className="leads-stats">
              <div>
                <div className="leads-stat-value">12 Weeks</div>
                <div className="leads-stat-label">Programme</div>
              </div>

              <div>
                <div className="leads-stat-value">Live</div>
                <div className="leads-stat-label">Mentorship</div>
              </div>

              <div>
                <div className="leads-stat-value">Real</div>
                <div className="leads-stat-label">Projects</div>
              </div>
            </div>
          </div>

          {/* LEAD FORM */}
          <div id="lead-form" className="leads-form-card">
            <span className="leads-form-tag">Start Your Journey</span>

            <h2 className="leads-form-title">Let&apos;s Build Your Future.</h2>

            <p className="leads-form-description">
              Tell us a little about yourself and select the programme that
              interests you.
            </p>

            <form onSubmit={handleSubmit} className="leads-form">
              <fieldset className="leads-form-fields" disabled={isSubmitting}>
                {/* FULL NAME */}
                <div className="leads-field">
                  <label htmlFor="lead-name">
                    Full Name <span className="leads-required">*</span>
                  </label>

                  <input
                    id="lead-name"
                    className="leads-input"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                {/* EMAIL */}
                <div className="leads-field">
                  <label htmlFor="lead-email">
                    Email Address <span className="leads-required">*</span>
                  </label>

                  <input
                    id="lead-email"
                    className="leads-input"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                {/* PHONE */}
                <div className="leads-field">
                  <label htmlFor="lead-phone">
                    Phone Number <span className="leads-required">*</span>
                  </label>

                  <input
                    id="lead-phone"
                    className="leads-input"
                    type="tel"
                    placeholder="+971 50 123 4567"
                    autoComplete="tel"
                    required
                    minLength={7}
                    maxLength={20}
                    pattern="[+0-9().\s-]{7,20}"
                    title="Enter a valid phone number"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>

                {/* PROGRAMME */}
                <div className="leads-field">
                  <label htmlFor="lead-programme">
                    Interested Programme{" "}
                    <span className="leads-required">*</span>
                  </label>

                  <select
                    id="lead-programme"
                    className="leads-input"
                    required
                    value={form.programme}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        programme: e.target.value,
                      })
                    }
                  >
                    <option value="" disabled>
                      Select your programme
                    </option>

                    <option value="AI">Technology &amp; AI</option>

                    <option value="ECOMMERCE">E-Commerce</option>

                    <option value="FREELANCING">Freelancing</option>
                  </select>
                </div>

                {/* CONSENT */}
                <label className="leads-consent">
                  <input
                    type="checkbox"
                    required
                    checked={form.consent}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        consent: e.target.checked,
                      })
                    }
                  />

                  <span>
                    I agree to be contacted by NextWave Build regarding my
                    selected programme and understand that I can withdraw my
                    consent at any time.
                  </span>
                </label>
              </fieldset>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className={`leads-primary-button leads-submit ${
                  isSubmitting ? "leads-button-loading" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="leads-spinner" aria-hidden="true" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit My Interest ↗</span>
                )}
              </button>

              <p className="leads-form-note">
                Explore your potential with NextWave Build.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* PROGRAMMES */}
      <section className="leads-programmes">
        <div className="leads-container">
          <p className="leads-section-tag">Explore Our Programmes</p>

          <h2 className="leads-section-heading">
            Choose the skills that shape your tomorrow.
          </h2>

          <div className="leads-programme-grid">
            {programmes.map((programme) => (
              <article key={programme.number} className="leads-programme-card">
                <span className="leads-programme-number">
                  / {programme.number}
                </span>

                <h3 className="leads-programme-title">{programme.title}</h3>

                <p className="leads-programme-text">{programme.description}</p>

                <a href="#lead-form" className="leads-programme-link">
                  Register Interest ↗
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="leads-footer">
        <div className="leads-container leads-footer-inner">
          <span>
            © {new Date().getFullYear()} NextWave Build. All rights reserved.
          </span>

          <span>Don&apos;t just learn it. Build it.</span>
        </div>
      </footer>

      {/* THANK YOU POPUP */}
      {success && (
        <div
          className="leads-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeSuccess();
            }
          }}
        >
          <div
            className="leads-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="leads-success-title"
          >
            <div className="leads-modal-icon">✓</div>

            <h2 id="leads-success-title">Thank You!</h2>

            <p>
              Your demo form has been submitted successfully. You&apos;ve taken
              the first step toward building your future.
            </p>

            <button
              type="button"
              className="leads-primary-button leads-submit"
              onClick={closeSuccess}
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
