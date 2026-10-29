"use client";

import { useEffect, useRef, useState } from "react";

const STEP_INTERVAL = 2000;

const steps = [
  {
    number: "01.",
    title: "Learn the Foundations",
    description:
      "Short, clear lessons cover the core ideas and tools you need.",
  },
  {
    number: "02.",
    title: "Practise the Skills",
    description:
      "Guided exercises help you try each skill until it feels natural.",
  },
  {
    number: "03.",
    title: "Build YOUR Project",
    description:
      "Bring it together in a real project you plan, create, and can share.",
  },
  {
    number: "04.",
    title: "Get Mentor Feedback",
    description: "A mentor reviews your work and suggests clear next steps.",
  },
];

export default function Method() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    // Activate the first card when animation starts
    const startTimer = window.setTimeout(() => {
      setActiveStep(0);
    }, 0);

    // Continue cycling through all four cards
    const interval = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, STEP_INTERVAL);

    return () => {
      window.clearTimeout(startTimer);
      window.clearInterval(interval);
    };
  }, [hasStarted]);

  return (
    <section ref={sectionRef} className="method section" id="how-it-works">
      <div className="shell">
        <div className="heading-line reveal">
          <div>
            <span className="eyebrow">The Learning Experience</span>

            <h2>
              From Lesson
              <br />
              To Launch.
            </h2>
          </div>
        </div>

        <div className="method-track">
          {steps.map((step, index) => (
            <div
              className={`method-box reveal ${
                activeStep === index ? "method-box-active" : ""
              }`}
              key={step.number}
            >
              <span className="num">{step.number}</span>

              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
