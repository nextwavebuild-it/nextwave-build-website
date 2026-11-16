"use client";

import { useEffect, useState } from "react";

const STORIES = [
  {
    heading: "NEW ORDER",
    caption: "Customer placed an order",
    product: "Urban Runner",
    amount: "$89.00",
    stage: 0,
    metric: "12",
    notification: "NEW ORDER RECEIVED",
  },
  {
    heading: "CHECKOUT",
    caption: "Payment confirmed",
    product: "Urban Runner",
    amount: "$89.00",
    stage: 1,
    metric: "13",
    notification: "PAYMENT CONFIRMED",
  },
  {
    heading: "FULFILLMENT",
    caption: "Package prepared for shipping",
    product: "Urban Runner",
    amount: "$89.00",
    stage: 2,
    metric: "13",
    notification: "ORDER READY TO SHIP",
  },
  {
    heading: "DELIVERED",
    caption: "Your customer is happy!",
    product: "Urban Runner",
    amount: "$89.00",
    stage: 3,
    metric: "13",
    notification: "ORDER DELIVERED",
  },
] as const;

export default function EcommerceHeroAnimation() {
  const [step, setStep] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReducedMotion(media.matches);
    change();
    media.addEventListener?.("change", change);
    return () => media.removeEventListener?.("change", change);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(
      () => setStep((previous) => (previous + 1) % STORIES.length),
      3000,
    );
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  const displayStep = reducedMotion ? 3 : step;
  const active = STORIES[displayStep];
  const progress = ["ORDER", "PAYMENT", "PACK", "DELIVER"];

  return (
    <div
      className="nw-ecommerce-animation"
      role="img"
      aria-label="Animated e-commerce storefront demonstrating a customer order, checkout, packing, and delivery"
    >
      <svg
        viewBox="0 0 900 650"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="ec-device" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#DCE5ED" />
            <stop offset=".52" stopColor="#8DA0B5" />
            <stop offset="1" stopColor="#405569" />
          </linearGradient>
          <linearGradient id="ec-background" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#1A3140" />
            <stop offset="1" stopColor="#0B151D" />
          </linearGradient>
          <linearGradient id="ec-product" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#D9FE66" />
            <stop offset=".65" stopColor="#99BE37" />
            <stop offset="1" stopColor="#4D732B" />
          </linearGradient>
          <filter id="ec-shadow" x="-40%" y="-50%" width="180%" height="220%">
            <feDropShadow
              dx="0"
              dy="14"
              stdDeviation="12"
              floodColor="#000"
              floodOpacity=".35"
            />
          </filter>
          <filter id="ec-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <clipPath id="ec-screen-clip">
            <rect x="161" y="152" width="579" height="363" rx="15" />
          </clipPath>
        </defs>

        {/* Soft background ambience */}
        <ellipse
          cx="451"
          cy="561"
          rx="343"
          ry="42"
          fill="#05090C"
          opacity=".5"
          filter="url(#ec-glow)"
        />
        <circle cx="467" cy="294" r="247" fill="#D9FE66" opacity=".035" />

        {/* Floating sales tag */}
        <g
          className={reducedMotion ? "" : "ec-float ec-float-left"}
          filter="url(#ec-shadow)"
        >
          <rect
            x="33"
            y="125"
            width="145"
            height="91"
            rx="19"
            fill="url(#ec-background)"
            stroke="#536C7A"
            strokeWidth="2"
          />
          <text
            x="52"
            y="158"
            fill="#A6BCC4"
            fontSize="13"
            fontWeight="700"
            letterSpacing="1"
          >
            SALES TODAY
          </text>
          <text x="52" y="192" fill="#D9FE66" fontSize="29" fontWeight="900">
            $1,240
          </text>
        </g>

        {/* Floating shopping bag */}
        <g
          className={reducedMotion ? "" : "ec-float ec-float-right"}
          filter="url(#ec-shadow)"
        >
          <rect
            x="737"
            y="110"
            width="124"
            height="114"
            rx="22"
            fill="url(#ec-background)"
            stroke="#536C7A"
            strokeWidth="2"
          />
          <path d="M774 150h48l-5 48h-38z" fill="#D9FE66" />
          <path
            d="M786 152v-10a12 12 0 0 1 24 0v10"
            stroke="#D9FE66"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M787 171l9 9 15-18"
            stroke="#13211F"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* Storefront device frame */}
        <g filter="url(#ec-shadow)">
          <rect
            x="148"
            y="139"
            width="605"
            height="391"
            rx="28"
            fill="url(#ec-device)"
            stroke="#E8F0F0"
            strokeWidth="5"
          />
          <rect
            x="158"
            y="149"
            width="585"
            height="371"
            rx="19"
            fill="#0D1B25"
          />
        </g>
        <g clipPath="url(#ec-screen-clip)">
          <rect x="161" y="152" width="579" height="363" fill="#101E28" />
          {/* Store top navigation */}
          <rect x="161" y="152" width="579" height="57" fill="#172A33" />
          <rect x="181" y="170" width="25" height="25" rx="7" fill="#D9FE66" />
          <path
            d="M188 185l5-6 6 6"
            fill="none"
            stroke="#12201F"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <text x="215" y="190" fill="#F5F3EC" fontSize="22" fontWeight="900">
            YOUR STORE
          </text>
          <text x="520" y="188" fill="#B5CBD0" fontSize="14" fontWeight="600">
            Products
          </text>
          <text x="607" y="188" fill="#B5CBD0" fontSize="14" fontWeight="600">
            Orders
          </text>
          <circle cx="704" cy="181" r="15" fill="#28403E" />
          <path
            d="M695 174h4l3 13h11l3-9h-14"
            fill="none"
            stroke="#D9FE66"
            strokeWidth="2.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="712"
            cy="170"
            r="7"
            fill="#D9FE66"
            className={reducedMotion ? "" : "ec-pulse"}
          />

          {/* Store listing and shoe mock-up */}
          <rect
            x="180"
            y="225"
            width="255"
            height="263"
            rx="16"
            fill="#1A3038"
            stroke="#33525C"
          />
          <rect
            x="193"
            y="239"
            width="229"
            height="159"
            rx="12"
            fill="#29434C"
          />
          <circle cx="304" cy="319" r="69" fill="#D9FE66" opacity=".09" />

          {/* Real sneaker product image with floating animation */}
          <g className={reducedMotion ? "" : "ec-shoe"}>
            <image
              href="/assets/Sneaker.webp"
              x="200"
              y="253"
              width="215"
              height="135"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>

          <text x="199" y="425" fill="#F5F3EC" fontSize="20" fontWeight="800">
            Urban Runner
          </text>
          <text x="199" y="453" fill="#D9FE66" fontSize="23" fontWeight="900">
            $89.00
          </text>
          <rect x="328" y="433" width="91" height="35" rx="9" fill="#D9FE66" />
          <text
            x="373"
            y="455"
            fill="#12201D"
            fontSize="12"
            fontWeight="900"
            textAnchor="middle"
          >
            ADD TO CART
          </text>

          {/* Checkout panel - intentionally large text for small hero renders */}
          <rect
            x="451"
            y="225"
            width="272"
            height="263"
            rx="16"
            fill="#132934"
            stroke="#365560"
          />
          <text
            x="471"
            y="258"
            fill="#D9FE66"
            fontSize="14"
            fontWeight="900"
            letterSpacing="1"
          >
            LIVE ORDER TRACKING
          </text>
          <text x="471" y="294" fill="#F5F3EC" fontSize="24" fontWeight="900">
            {active.heading}
          </text>
          <text x="471" y="320" fill="#D3E3E6" fontSize="15" fontWeight="600">
            {active.caption}
          </text>
          <line x1="471" y1="339" x2="703" y2="339" stroke="#365560" />
          {progress.map((label, index) => (
            <g key={label}>
              <circle
                cx={486 + index * 68}
                cy="372"
                r="13"
                fill={displayStep >= index ? "#D9FE66" : "#263E48"}
                stroke={displayStep >= index ? "#D9FE66" : "#6C818B"}
                strokeWidth="2"
              />
              {displayStep >= index ? (
                <path
                  d={`M${480 + index * 68} 372l4 4 8-9`}
                  fill="none"
                  stroke="#13201A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <circle cx={486 + index * 68} cy="372" r="3" fill="#9AAEB5" />
              )}
              <text
                x={486 + index * 68}
                y="405"
                fill={displayStep >= index ? "#D9FE66" : "#A5BDC4"}
                fontSize="10"
                fontWeight="800"
                textAnchor="middle"
              >
                {label}
              </text>
              {index < 3 && (
                <path
                  d={`M${501 + index * 68} 372h38`}
                  stroke={displayStep > index ? "#D9FE66" : "#425C65"}
                  strokeWidth="3"
                />
              )}
            </g>
          ))}
          <rect
            x="470"
            y="424"
            width="234"
            height="45"
            rx="10"
            fill="#D9FE66"
          />
          <text
            x="587"
            y="451"
            fill="#11201A"
            fontSize="16"
            fontWeight="900"
            textAnchor="middle"
          >
            {active.notification}
          </text>
        </g>

        {/* Device stand */}
        <path
          d="M392 531h115l23 46H369Z"
          fill="url(#ec-device)"
          stroke="#AABBC8"
          strokeWidth="3"
        />
        <path
          d="M340 577h221l23 16H318Z"
          fill="#9AABB9"
          stroke="#E4EEF2"
          strokeWidth="3"
        />

        {/* Foreground package: unique ecommerce detail */}
        <g
          transform="translate(86 493)"
          filter="url(#ec-shadow)"
          className={reducedMotion ? "" : "ec-package"}
        >
          <path d="M0 33 76 0 151 33 74 67Z" fill="#B1C1C1" />
          <path d="M0 33v69l74 37V67Z" fill="#7C929B" />
          <path d="M74 67v72l77-37V33Z" fill="#546E7A" />
          <path d="M40 16 115 50 115 118 96 127V57L21 26Z" fill="#D9FE66" />
          <path
            d="M18 83l25 13"
            stroke="#DCEAF0"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>

        {/* Tiny delivery truck, distinct from the AI robot scene */}
        <g
          transform="translate(665 512)"
          filter="url(#ec-shadow)"
          className={reducedMotion ? "" : "ec-truck"}
        >
          <rect x="0" y="23" width="113" height="69" rx="9" fill="#D9FE66" />
          <path d="M113 48h31l22 24v20h-53Z" fill="#F2F6E9" />
          <path d="M122 54h18l15 17h-33Z" fill="#233A45" />
          <rect
            x="13"
            y="41"
            width="65"
            height="8"
            rx="4"
            fill="#1C302A"
            opacity=".6"
          />
          <circle
            cx="35"
            cy="95"
            r="17"
            fill="#14242B"
            stroke="#A6B6BD"
            strokeWidth="5"
          />
          <circle
            cx="133"
            cy="95"
            r="17"
            fill="#14242B"
            stroke="#A6B6BD"
            strokeWidth="5"
          />
          <circle cx="35" cy="95" r="6" fill="#D9FE66" />
          <circle cx="133" cy="95" r="6" fill="#D9FE66" />
        </g>
      </svg>
      <style jsx>{`
        .nw-ecommerce-animation {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          overflow: hidden;
        }
        .nw-ecommerce-animation svg {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .ec-float {
          transform-box: fill-box;
          transform-origin: center;
          animation: ecFloat 4.5s ease-in-out infinite;
        }
        .ec-float-left {
          animation-delay: -0.7s;
        }
        .ec-float-right {
          animation-delay: -2.4s;
        }
        .ec-shoe {
          transform-box: fill-box;
          transform-origin: center;
          animation: ecShoe 3.6s ease-in-out infinite;
        }
        .ec-package {
          animation: ecPackage 3s ease-in-out infinite;
        }
        .ec-truck {
          animation: ecTruck 3s ease-in-out infinite;
        }
        .ec-pulse {
          animation: ecPulse 1.7s ease-in-out infinite;
        }
        @keyframes ecFloat {
          0%,
          100% {
            transform: translateY(0) rotate(-2deg);
          }
          50% {
            transform: translateY(-11px) rotate(2deg);
          }
        }
        @keyframes ecShoe {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }
        @keyframes ecPackage {
          0%,
          100% {
            transform: translate(86px, 493px) rotate(-2deg);
          }
          50% {
            transform: translate(86px, 488px) rotate(1deg);
          }
        }
        @keyframes ecTruck {
          0%,
          100% {
            transform: translate(665px, 512px);
          }
          50% {
            transform: translate(674px, 512px);
          }
        }
        @keyframes ecPulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.35;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .nw-ecommerce-animation * {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
