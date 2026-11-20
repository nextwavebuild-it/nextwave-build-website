"use client";

import { useEffect, useRef, useState } from "react";

const STEP_INTERVAL = 2000;

const steps = [
  {
    number: "01.",
    title: "LEARN THE FOUNDATIONS",
    description: "Build digital skills through clear, structured lessons.",
  },
  {
    number: "02.",
    title: "PRACTISE THE SKILLS",
    description: "Gain hands-on experience through guided exercises.",
  },
  {
    number: "03.",
    title: "BUILD YOUR PROJECT",
    description: "Create practical projects that showcase your abilities.",
  },
  {
    number: "04.",
    title: "GET MENTOR FEEDBACK",
    description: "Improve your work with mentor guidance and feedback.",
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

            {/* SEO-optimized H2 heading */}
            <h2>Learn Through Real-World Projects</h2>
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
              {/* Card number - SPAN */}
              <span className="num">{step.number}</span>

              {/* Card title - H3 */}
              <h3>{step.title}</h3>

              {/* Card description - P */}
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
