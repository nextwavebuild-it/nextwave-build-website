"use client";

import { useEffect, useState } from "react";

const LESSONS = [
  {
    topic: "BUILD YOUR PORTFOLIO",
    sub: "Showcase your best work",
    task: "Portfolio review",
    progress: 30,
  },
  {
    topic: "WORK WITH CLIENTS",
    sub: "Understand a project brief",
    task: "Client communication",
    progress: 60,
  },
  {
    topic: "DELIVER REAL PROJECTS",
    sub: "Present, improve & deliver",
    task: "Project feedback",
    progress: 90,
  },
] as const;

export default function FreelancingHeroAnimation() {
  const [lessonIndex, setLessonIndex] = useState(0);
  const lesson = LESSONS[lessonIndex];

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (motionPreference.matches) return;
    const timer = window.setInterval(() => {
      setLessonIndex((previous) => (previous + 1) % LESSONS.length);
    }, 5400);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className="nw-freelance-animation"
      role="img"
      aria-label="Illustrated animated laptop showing a mentor teaching freelancing skills to students in a live online class"
    >
      <svg
        viewBox="0 0 900 650"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="fl-body" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#F1F5F9" />
            <stop offset=".48" stopColor="#AFBED0" />
            <stop offset="1" stopColor="#61788F" />
          </linearGradient>
          <linearGradient id="fl-display" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#172D3D" />
            <stop offset="1" stopColor="#0A151E" />
          </linearGradient>
          <linearGradient id="fl-video" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#344F68" />
            <stop offset="1" stopColor="#142733" />
          </linearGradient>
          <linearGradient id="fl-shirt" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#263B57" />
            <stop offset="1" stopColor="#111E32" />
          </linearGradient>
          <filter id="fl-shadow" x="-30%" y="-40%" width="160%" height="200%">
            <feDropShadow
              dx="0"
              dy="17"
              stdDeviation="17"
              floodColor="#000000"
              floodOpacity=".36"
            />
          </filter>
          <clipPath id="fl-mentor-clip">
            <rect x="167" y="201" width="385" height="251" rx="12" />
          </clipPath>
          <clipPath id="fl-screen-clip">
            <rect x="112" y="123" width="676" height="405" rx="15" />
          </clipPath>
        </defs>

        {/* The laptop is the complete illustration: no external frames, stickers, or badges. */}
        <ellipse cx="454" cy="580" rx="360" ry="31" fill="#000" opacity=".24" />
        <g filter="url(#fl-shadow)">
          <rect
            x="93"
            y="102"
            width="715"
            height="447"
            rx="29"
            fill="url(#fl-body)"
            stroke="#E8EDF3"
            strokeWidth="4"
          />
          <rect
            x="105"
            y="114"
            width="691"
            height="421"
            rx="19"
            fill="#07131E"
          />
          <circle cx="450" cy="110" r="3" fill="#6E8D9F" />
        </g>

        <g clipPath="url(#fl-screen-clip)">
          <rect
            x="112"
            y="123"
            width="676"
            height="405"
            fill="url(#fl-display)"
          />
          {/* video meeting header */}
          <rect x="112" y="123" width="676" height="60" fill="#111F2C" />
          <rect x="131" y="139" width="27" height="27" rx="8" fill="#D9FE66" />
          <path
            d="M138 158l6-10 7 10"
            fill="none"
            stroke="#12201D"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <text x="168" y="159" fill="#F5F3EC" fontSize="20" fontWeight="800">
            NEXTWAVE LIVE
          </text>
          <circle
            cx="573"
            cy="153"
            r="5.5"
            fill="#D9FE66"
            className="fl-pulse"
          />
          <text x="587" y="159" fill="#D9FE66" fontSize="13" fontWeight="800">
            LIVE CLASS
          </text>
          <text x="701" y="158" fill="#B4C9D0" fontSize="12" fontWeight="600">
            4 PEOPLE
          </text>

          {/* main instructor video tile */}
          <rect
            x="160"
            y="195"
            width="399"
            height="263"
            rx="17"
            fill="#304D61"
            stroke="#547080"
            strokeWidth="2"
          />
          <g clipPath="url(#fl-mentor-clip)">
            <rect
              x="167"
              y="201"
              width="385"
              height="251"
              fill="url(#fl-video)"
            />
            <circle cx="480" cy="235" r="92" fill="#6888A0" opacity=".16" />
            <rect
              x="192"
              y="244"
              width="93"
              height="91"
              rx="10"
              fill="#1A3345"
              opacity=".9"
            />
            <path d="M210 318l15-19 14 11 18-26 17 34Z" fill="#49677A" />
            <circle cx="259" cy="264" r="9" fill="#D9FE66" opacity=".7" />
            <rect
              x="410"
              y="230"
              width="104"
              height="11"
              rx="5"
              fill="#7195AA"
              opacity=".22"
            />
            <rect
              x="410"
              y="249"
              width="79"
              height="9"
              rx="4"
              fill="#7195AA"
              opacity=".2"
            />

            {/* mentor torso */}
            <path
              d="M251 446Q261 360 352 353Q439 354 459 446Z"
              fill="url(#fl-shirt)"
            />
            <path
              d="M323 364l26 24 24-24"
              fill="none"
              stroke="#516C80"
              strokeWidth="7"
            />
            <path d="M333 345v26q19 21 35-1v-25" fill="#BD8066" />
            {/* Head & hair */}
            <ellipse cx="350" cy="291" rx="59" ry="72" fill="#C98E72" />
            <path
              d="M292 286Q282 227 323 220Q355 190 394 222Q413 241 407 287Q393 266 384 251Q352 261 318 248Q313 272 292 286Z"
              fill="#17232D"
            />
            <path
              d="M299 294Q299 353 350 362Q404 352 401 294Q393 323 377 334Q353 344 329 333Q310 326 299 294Z"
              fill="#25303A"
            />
            <path
              d="M315 288q13-7 26 0M362 288q13-7 26 0"
              stroke="#243039"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="330" cy="291" r="3" fill="#1C2931" />
            <circle cx="375" cy="291" r="3" fill="#1C2931" />
            <path
              d="M350 292l-3 15 8 1"
              stroke="#915E4A"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* mouth animates like the mentor is speaking */}
            <ellipse
              className="fl-speak"
              cx="352"
              cy="323"
              rx="9"
              ry="4"
              fill="#EAB9A1"
            />
            {/* mentor's gesturing hand */}
            <g className="fl-gesture">
              <path
                d="M432 418Q467 389 471 365Q474 350 465 342Q458 338 455 346L446 360L442 330Q440 319 433 323Q427 326 428 336L426 357Q417 337 409 340Q403 344 412 360L421 381L404 370Q393 364 391 371Q390 376 404 389L429 412Z"
                fill="#C98E72"
                stroke="#AA735A"
                strokeWidth="3"
              />
            </g>
            {/* teacher title overlay */}
            <rect
              x="179"
              y="407"
              width="211"
              height="37"
              rx="9"
              fill="#0C1B27"
              opacity=".94"
            />
            <circle cx="196" cy="425" r="5" fill="#D9FE66" />
            <text x="208" y="430" fill="#F5F3EC" fontSize="15" fontWeight="800">
              YOUR LIVE MENTOR
            </text>
          </g>

          {/* Student tiles: three different illustrated students */}
          <rect
            x="574"
            y="201"
            width="187"
            height="76"
            rx="10"
            fill="#264050"
            stroke="#4C6675"
          />
          <circle cx="608" cy="236" r="22" fill="#D7A181" />
          <path
            d="M586 231q4-27 26-22 16 4 18 21l-9-8q-18 6-35 9"
            fill="#242630"
          />
          <path d="M581 264q27-23 54 0" fill="#27375B" />
          <text x="649" y="231" fill="#F5F3EC" fontSize="15" fontWeight="800">
            Student 01
          </text>
          <text x="649" y="250" fill="#AFBBC7" fontSize="11">
            Learning live
          </text>

          <rect
            x="574"
            y="288"
            width="187"
            height="76"
            rx="10"
            fill="#264050"
            stroke="#4C6675"
          />
          <circle cx="608" cy="323" r="22" fill="#B77758" />
          <path
            d="M586 322q0-25 22-25 23 0 23 24l-13-14-32 15"
            fill="#19242C"
          />
          <path d="M581 351q27-23 54 0" fill="#567580" />
          <text x="649" y="318" fill="#F5F3EC" fontSize="15" fontWeight="800">
            Student 02
          </text>
          <text x="649" y="337" fill="#AFBBC7" fontSize="11">
            Practising
          </text>

          <rect
            x="574"
            y="375"
            width="187"
            height="76"
            rx="10"
            fill="#264050"
            stroke="#4C6675"
          />
          <circle cx="608" cy="409" r="22" fill="#D4A17F" />
          <path
            d="M587 411q-7-32 19-31 29-1 25 32l-10-19q-20 4-34 18"
            fill="#3B2C30"
          />
          <path d="M581 438q27-23 54 0" fill="#485B72" />
          <text x="649" y="406" fill="#F5F3EC" fontSize="15" fontWeight="800">
            Student 03
          </text>
          <text x="649" y="425" fill="#AFBBC7" fontSize="11">
            Taking notes
          </text>

          {/* active lesson below call */}
          <rect
            x="160"
            y="466"
            width="601"
            height="48"
            rx="12"
            fill="#192C37"
          />
          <circle cx="184" cy="489" r="10" fill="#D9FE66" />
          <path
            d="M180 489l3 3 6-7"
            fill="none"
            stroke="#15241A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="204" y="486" fill="#F5F3EC" fontSize="16" fontWeight="800">
            {lesson.topic}
          </text>
          <text x="204" y="502" fill="#AEC8D0" fontSize="11">
            {lesson.sub}
          </text>
          <rect x="610" y="482" width="123" height="5" rx="3" fill="#3B5561" />
          <rect
            x="610"
            y="482"
            width={(123 * lesson.progress) / 100}
            height="5"
            rx="3"
            fill="#D9FE66"
          />
          <text
            x="670"
            y="501"
            fill="#D9FE66"
            fontSize="10"
            fontWeight="700"
            textAnchor="middle"
          >
            {lesson.task}
          </text>
        </g>

        {/* laptop lower body and keyboard */}
        <path
          d="M98 546L805 546 887 584Q893 591 875 597L34 597Q19 591 33 583Z"
          fill="url(#fl-body)"
          stroke="#E6EEF2"
          strokeWidth="3"
          filter="url(#fl-shadow)"
        />
        <path d="M139 555H760L809 580H93Z" fill="#4B6277" />
        {Array.from({ length: 4 }, (_, row) =>
          Array.from({ length: 19 }, (_, col) => (
            <rect
              key={`${row}-${col}`}
              x={144 + col * 31 - row * 7}
              y={557 + row * 5.8}
              width="24"
              height="3.2"
              rx="1.6"
              fill="#BCC9D7"
              opacity=".69"
            />
          )),
        )}
        <path d="M382 583h133l15 9H366Z" fill="#96A9BD" opacity=".9" />
      </svg>
      <style jsx>{`
        .nw-freelance-animation {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          overflow: visible;
        }
        .nw-freelance-animation svg {
          display: block;
          width: 100%;
          height: auto;
          max-height: 100%;
          overflow: visible;
        }
        .fl-speak {
          transform-box: fill-box;
          transform-origin: center;
          animation: flSpeak 0.6s ease-in-out infinite;
        }
        .fl-gesture {
          transform-box: fill-box;
          transform-origin: 30% 88%;
          animation: flGesture 3.5s ease-in-out infinite;
        }
        .fl-pulse {
          animation: flPulse 1.5s ease-in-out infinite;
        }
        @keyframes flSpeak {
          0%,
          100% {
            transform: scaleY(0.55);
          }
          50% {
            transform: scaleY(2.15);
          }
        }
        @keyframes flGesture {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-9deg);
          }
        }
        @keyframes flPulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .nw-freelance-animation * {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
