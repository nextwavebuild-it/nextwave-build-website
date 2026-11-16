"use client";

import { useEffect, useState } from "react";

type Scenario = {
  prompt: string;
  response: string[];
  label: string;
  icons: [string, string, string];
};

const SCENARIOS: Scenario[] = [
  {
    prompt: "Build an AI chatbot",
    response: [
      "Creating chat interface...",
      "Connecting AI assistant...",
      "Chatbot ready ✓",
    ],
    label: "CHATBOT BUILT",
    icons: ["CHAT", "AI", "CODE"],
  },
  {
    prompt: "Analyze sales data",
    response: [
      "Reading dataset...",
      "Generating insights...",
      "Dashboard ready ✓",
    ],
    label: "INSIGHTS READY",
    icons: ["DATA", "CHART", "AI"],
  },
  {
    prompt: "Automate a workflow",
    response: [
      "Mapping tasks...",
      "Connecting actions...",
      "Workflow active ✓",
    ],
    label: "WORKFLOW LIVE",
    icons: ["FLOW", "AUTO", "CODE"],
  },
];

// All artwork, including the robot and its facial features, is real SVG.
// There are no image assets, third-party animation dependencies, or AI requests.
export default function AIHeroAnimation() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [characters, setCharacters] = useState(0);
  const [phase, setPhase] = useState<"type" | "process" | "done">("type");
  const [reducedMotion, setReducedMotion] = useState(false);

  const scenario = SCENARIOS[scenarioIndex];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const duration = 6400;
    const start = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = (Date.now() - start) % duration;
      const nextIndex =
        Math.floor((Date.now() - start) / duration) % SCENARIOS.length;
      const current = SCENARIOS[nextIndex];
      setScenarioIndex(nextIndex);
      if (elapsed < 1800) {
        setPhase("type");
        setCharacters(
          Math.min(current.prompt.length, Math.floor(elapsed / 65)),
        );
      } else if (elapsed < 3950) {
        setPhase("process");
        setCharacters(current.prompt.length);
      } else {
        setPhase("done");
        setCharacters(current.prompt.length);
      }
    }, 75);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  const displayPrompt = reducedMotion
    ? scenario.prompt
    : scenario.prompt.slice(0, characters);
  const completedLines = reducedMotion
    ? scenario.response.length
    : phase === "done"
      ? 3
      : phase === "process"
        ? 2
        : 0;

  return (
    <div
      className="nw-ai-animation"
      role="img"
      aria-label="Animated AI learning workspace with a blinking robot, a laptop typing example AI prompts, and changing project icons"
    >
      <svg
        viewBox="0 0 900 650"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="nw-laptop" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#9CAAC4" />
            <stop offset=".5" stopColor="#E9EDF4" />
            <stop offset="1" stopColor="#7183A2" />
          </linearGradient>
          <linearGradient id="nw-screen" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#152A3C" />
            <stop offset="1" stopColor="#070E17" />
          </linearGradient>
          <linearGradient id="nw-robot" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FFFFFF" />
            <stop offset=".65" stopColor="#DFE9F2" />
            <stop offset="1" stopColor="#A7B6CB" />
          </linearGradient>
          <linearGradient id="nw-card" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#273D54" />
            <stop offset="1" stopColor="#0B1722" />
          </linearGradient>
          <radialGradient id="nw-glow">
            <stop stopColor="#D9FE66" stopOpacity=".38" />
            <stop offset="1" stopColor="#D9FE66" stopOpacity="0" />
          </radialGradient>
          <filter
            id="nw-soft-glow"
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
          >
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="nw-shadow" x="-30%" y="-40%" width="160%" height="200%">
            <feDropShadow
              dx="0"
              dy="15"
              stdDeviation="14"
              floodColor="#000000"
              floodOpacity=".38"
            />
          </filter>
          <clipPath id="nw-screen-clip">
            <rect x="184" y="194" width="478" height="294" rx="13" />
          </clipPath>
        </defs>

        <ellipse
          cx="441"
          cy="567"
          rx="330"
          ry="48"
          fill="#000"
          opacity=".26"
          filter="url(#nw-soft-glow)"
        />
        <circle cx="475" cy="286" r="240" fill="url(#nw-glow)" opacity=".35" />

        {/* Floating learning icon badges. The current prompt controls their labels. */}
        <g className={reducedMotion ? "" : "nw-float nw-delay-a"}>
          <rect
            x="75"
            y="134"
            width="111"
            height="92"
            rx="20"
            fill="url(#nw-card)"
            stroke="#61758C"
            strokeWidth="2"
          />
          <path
            d="M102 190 l15 -16 -15 -16 M154 158 l-15 16 15 16 M131 154 l-8 41"
            fill="none"
            stroke="#D9FE66"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="130"
            y="211"
            fill="#F5F3EC"
            fontSize="10"
            textAnchor="middle"
            fontWeight="700"
            letterSpacing="2"
          >
            {scenario.icons[2]}
          </text>
        </g>
        <g className={reducedMotion ? "" : "nw-float nw-delay-b"}>
          <rect
            x="375"
            y="25"
            width="160"
            height="111"
            rx="23"
            fill="url(#nw-card)"
            stroke="#61758C"
            strokeWidth="2"
          />
          <g fill="none" stroke="#D9FE66" strokeWidth="3" strokeLinecap="round">
            <path d="M434 76c-14-20 7-30 17-19 10-16 28-3 23 12 18 8 9 28-5 29-5 14-21 14-27 1-14 7-27-10-15-21Z" />
            <path
              d="M452 58v43 M435 75l17 8 17-11 M439 90l13-7 15 10"
              strokeWidth="2"
              opacity=".7"
            />
          </g>
          <text
            x="455"
            y="119"
            fill="#D9FE66"
            fontSize="10"
            textAnchor="middle"
            fontWeight="800"
            letterSpacing="2"
          >
            {scenario.icons[1]}
          </text>
        </g>
        <g className={reducedMotion ? "" : "nw-float nw-delay-c"}>
          <rect
            x="701"
            y="130"
            width="115"
            height="92"
            rx="20"
            fill="url(#nw-card)"
            stroke="#61758C"
            strokeWidth="2"
          />
          <rect x="724" y="159" width="16" height="28" rx="3" fill="#D9FE66" />
          <rect
            x="748"
            y="146"
            width="16"
            height="41"
            rx="3"
            fill="#D9FE66"
            opacity=".8"
          />
          <rect
            x="772"
            y="170"
            width="16"
            height="17"
            rx="3"
            fill="#D9FE66"
            opacity=".65"
          />
          <text
            x="759"
            y="207"
            fill="#F5F3EC"
            fontSize="10"
            textAnchor="middle"
            fontWeight="700"
            letterSpacing="1.5"
          >
            {scenario.icons[0]}
          </text>
        </g>

        {/* Books, an academic cue without clutter. */}
        <g transform="translate(30 415)" filter="url(#nw-shadow)">
          <path d="M0 61 L136 41 L180 62 L45 84Z" fill="#D9FE66" />
          <path d="M3 73L46 94 182 70 180 62 45 84 0 61Z" fill="#A4C641" />
          <path d="M14 25 L141 5 L179 23 L52 48Z" fill="#466487" />
          <path d="M14 25L52 48 52 75 14 51Z" fill="#213C5A" />
          <path d="M52 48L179 23 179 50 52 75Z" fill="#F0F0E9" />
          <path
            d="M50 0 L107 -23 L166 0 L110 24Z"
            fill="#192B40"
            stroke="#D9FE66"
            strokeWidth="2"
          />
          <path d="M110 24v23 M166 0v28" stroke="#D9FE66" strokeWidth="3" />
        </g>

        {/* Laptop shell */}
        <g filter="url(#nw-shadow)">
          <path
            d="M190 173 L657 173 Q678 173 678 196 L678 489 Q678 505 658 505 L187 505 Q168 505 168 485 L168 195 Q168 173 190 173Z"
            fill="#556B86"
            stroke="#E4EBF2"
            strokeWidth="5"
          />
          <rect
            x="181"
            y="187"
            width="484"
            height="307"
            rx="15"
            fill="url(#nw-screen)"
            stroke="#0A1520"
            strokeWidth="5"
          />
          <circle cx="422" cy="181" r="3" fill="#CAD3DF" />
        </g>

        {/* Enlarged high-contrast AI workspace — no miniature sidebar */}
        <g clipPath="url(#nw-screen-clip)">
          <rect x="184" y="194" width="478" height="294" fill="#0A1520" />

          {/* Clear title bar */}
          <rect x="194" y="201" width="458" height="48" rx="8" fill="#172D3B" />
          <circle cx="213" cy="225" r="6" fill="#D9FE66" />
          <text x="232" y="233" fill="#F5F3EC" fontSize="22" fontWeight="800">
            AI WORKSPACE
          </text>
          <circle
            cx="621"
            cy="225"
            r="6"
            fill="#D9FE66"
            className={reducedMotion ? "" : "nw-pulse"}
          />

          {/* Main prompt: wide panel with readable font */}
          <text
            x="208"
            y="278"
            fill="#D9FE66"
            fontSize="16"
            fontWeight="800"
            letterSpacing="1"
          >
            YOUR PROMPT
          </text>
          <rect
            x="201"
            y="290"
            width="444"
            height="58"
            rx="10"
            fill="#152838"
            stroke="#537184"
            strokeWidth="2"
          />
          <text x="215" y="327" fill="#FFFFFF" fontSize="22" fontWeight="700">
            {displayPrompt}
          </text>
          {phase === "type" && !reducedMotion && (
            <rect
              x={217 + displayPrompt.length * 11.9}
              y="306"
              width="3"
              height="27"
              fill="#D9FE66"
              className="nw-cursor"
            />
          )}

          {/* Assistant response with three large, strongly contrasted lines */}
          <text
            x="208"
            y="376"
            fill="#D9FE66"
            fontSize="16"
            fontWeight="800"
            letterSpacing="1"
          >
            AI RESPONSE
          </text>
          <rect
            x="201"
            y="388"
            width="444"
            height="92"
            rx="10"
            fill="#193346"
            stroke="#446679"
            strokeWidth="2"
          />
          {scenario.response.slice(0, completedLines).map((line, i) => (
            <g key={`${scenarioIndex}-${i}`}>
              <circle
                cx="221"
                cy={412 + i * 27}
                r="5"
                fill={i === 2 ? "#D9FE66" : "#8EE2EA"}
              />
              <text
                x="239"
                y={418 + i * 27}
                fill={i === 2 ? "#D9FE66" : "#FFFFFF"}
                fontSize="18"
                fontWeight={i === 2 ? "800" : "600"}
              >
                {line}
              </text>
            </g>
          ))}
          {phase === "process" && (
            <text x="239" y="472" fill="#F5F3EC" fontSize="14">
              Processing...
            </text>
          )}
        </g>

        {/* Laptop base and keyboard */}
        <path
          d="M167 504L679 504 791 554 Q799 560 787 568L117 568 Q102 562 113 555Z"
          fill="url(#nw-laptop)"
          stroke="#E9EDF4"
          strokeWidth="3"
          filter="url(#nw-shadow)"
        />
        <path d="M201 514L657 514 724 544 157 544Z" fill="#334860" />
        {Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 15 }, (_, col) => (
            <rect
              key={`${row}-${col}`}
              x={215 + col * 27 - row * 9}
              y={518 + row * 5.2}
              width="21"
              height="3.4"
              rx="1.5"
              fill="#AABAD0"
              opacity=".65"
            />
          )),
        )}
        <path d="M386 546h127l17 12H367Z" fill="#9CAAC4" opacity=".8" />

        {/* Friendly robot: floats and blinks independently of the scene. */}
        <g
          transform="translate(679 425)"
          className={reducedMotion ? "" : "nw-robot-float"}
        >
          <ellipse cx="34" cy="157" rx="80" ry="18" fill="#000" opacity=".28" />
          <path
            d="M-7 83C-26 90-28 125-11 139C13 163 75 166 93 140C110 115 98 86 75 77Z"
            fill="url(#nw-robot)"
            stroke="#849BB2"
            strokeWidth="4"
          />
          <path
            d="M-7 111C-34 101-44 118-39 137C-34 153-17 153-8 140"
            fill="url(#nw-robot)"
            stroke="#849BB2"
            strokeWidth="3"
          />
          <path
            d="M95 107C122 99 135 118 128 138C122 151 108 151 97 140"
            fill="url(#nw-robot)"
            stroke="#849BB2"
            strokeWidth="3"
          />
          <rect
            x="-33"
            y="-12"
            width="139"
            height="110"
            rx="49"
            fill="url(#nw-robot)"
            stroke="#839BB1"
            strokeWidth="5"
          />
          <rect
            x="-22"
            y="0"
            width="118"
            height="82"
            rx="36"
            fill="#091522"
            stroke="#465A70"
            strokeWidth="3"
          />
          <g
            className={reducedMotion ? "" : "nw-robot-eyes"}
            fill="none"
            stroke="#D9FE66"
            strokeWidth="8"
            strokeLinecap="round"
          >
            <path d="M0 34q11 -13 22 0" />
            <path d="M53 34q11 -13 22 0" />
          </g>
          <path
            d="M28 57q11 10 23 0"
            stroke="#78E6D6"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <circle
            cx="109"
            cy="44"
            r="14"
            fill="#60778D"
            stroke="#D9FE66"
            strokeWidth="6"
          />
          <path
            d="M39-14v-18"
            stroke="#B1C0CB"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle
            cx="39"
            cy="-40"
            r="9"
            fill="#D9FE66"
            className={reducedMotion ? "" : "nw-pulse"}
          />
          <ellipse
            cx="42"
            cy="122"
            rx="12"
            ry="7"
            fill="#D9FE66"
            opacity=".65"
          />
        </g>

        {/* Current prompt changes the floating status ribbon. */}
        <g transform="translate(478 567)">
          <rect
            width="229"
            height="42"
            rx="21"
            fill="#10212B"
            stroke="#D9FE66"
            strokeOpacity=".7"
          />
          <circle
            cx="23"
            cy="21"
            r="6"
            fill="#D9FE66"
            className={reducedMotion ? "" : "nw-pulse"}
          />
          <text
            x="40"
            y="26"
            fontSize="12"
            fontWeight="800"
            letterSpacing="1.5"
            fill="#F5F3EC"
          >
            {phase === "done" || reducedMotion
              ? scenario.label
              : "AI IS BUILDING..."}
          </text>
        </g>
      </svg>
      <style jsx>{`
        .nw-ai-animation {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          overflow: hidden;
        }
        .nw-ai-animation svg {
          display: block;
          width: 100%;
          height: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .nw-float {
          animation: nwFloat 5.1s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        .nw-delay-a {
          animation-delay: -0.6s;
        }
        .nw-delay-b {
          animation-delay: -2s;
        }
        .nw-delay-c {
          animation-delay: -3.4s;
        }
        .nw-robot-float {
          animation: nwRobot 3.8s ease-in-out infinite;
        }
        .nw-robot-eyes {
          transform-origin: 38px 34px;
          animation: nwBlink 4.8s infinite;
        }
        .nw-pulse {
          animation: nwPulse 1.7s ease-in-out infinite;
        }
        .nw-cursor {
          animation: nwCursor 0.65s steps(1) infinite;
        }
        @keyframes nwFloat {
          0%,
          100% {
            transform: translateY(0) rotate(-2deg);
          }
          50% {
            transform: translateY(-11px) rotate(2deg);
          }
        }
        @keyframes nwRobot {
          0%,
          100% {
            transform: translate(679px, 425px) rotate(-2deg);
          }
          50% {
            transform: translate(679px, 415px) rotate(3deg);
          }
        }
        @keyframes nwBlink {
          0%,
          42%,
          46%,
          90%,
          94%,
          100% {
            transform: scaleY(1);
          }
          44%,
          92% {
            transform: scaleY(0.08);
          }
        }
        @keyframes nwPulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.35;
          }
        }
        @keyframes nwCursor {
          50% {
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .nw-ai-animation * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
