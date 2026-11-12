import type { Metadata } from "next";
import Image from "next/image";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "E-Commerce & Dropshipping | NextWave Build",
  description:
    "Learn E-Commerce & Dropshipping in 12 weeks with live mentor-led training. Research products, build an online store, learn marketing and complete your own practical project.",
  alternates: {
    canonical: "/programmes/ecommerce-dropshipping",
  },
  openGraph: {
    title: "E-Commerce & Dropshipping | NextWave Build",
    description:
      "Don't just learn e-commerce. Build your own online store with mentor support.",
    type: "website",
  },
};

const ENROLL_URL =
  "https://portal.nextwavebuild.com/register?flagship=ECOMMERCE";

const outcomes = [
  {
    number: "01",
    title: "E-Commerce Fundamentals",
    description:
      "Understand online business models, e-commerce platforms, and how dropshipping works.",
  },
  {
    number: "02",
    title: "Product & Niche Research",
    description:
      "Learn how to evaluate products, research market demand, and understand customer needs.",
  },
  {
    number: "03",
    title: "Online Store Development",
    description:
      "Build your own online store with product pages, collections, navigation, and checkout essentials.",
  },
  {
    number: "04",
    title: "Supplier & Order Management",
    description:
      "Explore supplier selection, fulfillment processes, order management, and customer service.",
  },
  {
    number: "05",
    title: "Digital Marketing",
    description:
      "Understand social media marketing, advertising fundamentals, content planning, and customer acquisition.",
  },
  {
    number: "06",
    title: "Analytics & Optimization",
    description:
      "Understand store performance, analyze customer behavior, and identify areas for improvement.",
  },
];

const roadmap = [
  {
    number: "01",
    weeks: "WEEKS 01–03",
    title: "Learn & Research",
    description:
      "Build your foundation and discover how successful e-commerce businesses are structured.",
    topics: [
      "Introduction to e-commerce",
      "Dropshipping business models",
      "Product and niche research",
      "Market and competitor analysis",
    ],
    project: "Choose your niche and develop your store concept.",
  },
  {
    number: "02",
    weeks: "WEEKS 04–06",
    title: "Design & Build",
    description:
      "Turn your store concept into a practical online shopping experience.",
    topics: [
      "Store platform introduction",
      "Store design and branding",
      "Product pages and collections",
      "Checkout and basic configuration",
    ],
    project: "Create your first functional practice store.",
  },
  {
    number: "03",
    weeks: "WEEKS 07–09",
    title: "Market & Manage",
    description:
      "Learn how e-commerce businesses reach customers and manage everyday operations.",
    topics: [
      "Digital marketing fundamentals",
      "Content and social media strategies",
      "Supplier and order management",
      "Store analytics and improvements",
    ],
    project: "Develop a marketing plan for your store.",
  },
  {
    number: "04",
    weeks: "WEEKS 10–12",
    title: "Improve & Present",
    description:
      "Apply what you have learned and refine your project through guided practice.",
    topics: [
      "Store testing and improvements",
      "Customer experience optimization",
      "Final project preparation",
      "Mentor feedback and presentation",
    ],
    project: "Present your completed e-commerce project.",
  },
];

const learningSteps = [
  {
    number: "01.",
    title: "Learn the Foundations",
    description:
      "Understand e-commerce concepts, online selling, and the tools used to build a store.",
  },
  {
    number: "02.",
    title: "Practise the Skills",
    description:
      "Complete guided exercises in product research, store design, and marketing.",
  },
  {
    number: "03.",
    title: "Build Your Store",
    description:
      "Apply your skills to create an online store project that belongs to you.",
  },
  {
    number: "04.",
    title: "Get Mentor Feedback",
    description:
      "Review your project with a mentor and receive clear suggestions for improvement.",
  },
];

const projectSteps = [
  "Select a niche and research suitable products.",
  "Create your store identity and storefront.",
  "Add products and configure essential features.",
  "Develop your marketing and operations plan.",
  "Review, improve, and present your completed project.",
];

const mentorBenefits = [
  {
    number: "01",
    title: "Live Learning Sessions",
    description:
      "Learn directly from mentors who guide you through concepts, tools, and practical exercises.",
  },
  {
    number: "02",
    title: "Project Guidance",
    description:
      "Get support while developing your online store instead of figuring everything out alone.",
  },
  {
    number: "03",
    title: "Practical Feedback",
    description:
      "Receive constructive feedback on your project and understand what to improve.",
  },
];

const audience = [
  "Complete beginners",
  "Students & fresh graduates",
  "Aspiring entrepreneurs",
  "Freelancers",
  "Working professionals",
  "Anyone exploring online business",
];

const faqs = [
  {
    question: "Do I need any previous experience?",
    answer:
      "No. The programme begins with e-commerce fundamentals and introduces more advanced concepts gradually. It is designed to be accessible to beginners.",
  },
  {
    question: "How long is the programme?",
    answer:
      "The E-Commerce & Dropshipping programme runs for 12 weeks and follows a structured practical learning roadmap.",
  },
  {
    question: "Will I build my own online store?",
    answer:
      "Yes. Creating an online store project is a core part of the programme. You will apply what you learn and improve your project with mentor guidance.",
  },
  {
    question: "Will mentors teach us live?",
    answer:
      "The programme includes live mentor-led learning and practical project guidance. Your mentor helps you understand concepts, practise skills, and review your progress.",
  },
  {
    question: "Do I need money to run advertisements?",
    answer:
      "You can learn advertising principles and create marketing plans without running paid campaigns. If you decide to launch a live store, external platform, domain, or advertising costs may apply.",
  },
  {
    question: "Does this programme guarantee sales?",
    answer:
      "No. The programme focuses on practical skills and project development. Actual business performance depends on market conditions, execution, and other factors.",
  },
  {
    question: "How can I register?",
    answer:
      "Click any Enroll Now button. You will be redirected to the NextWave Build registration application to complete your enrollment.",
  },
];

function EnrollButton({
  label = "Enroll Now",
  outline = false,
}: {
  label?: string;
  outline?: boolean;
}) {
  return (
    <a
      href={ENROLL_URL}
      className={`${styles.button} ${
        outline ? styles.buttonOutline : styles.buttonAcid
      }`}
    >
      <span>{label}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}

function Heading({
  eyebrow,
  children,
  description,
}: {
  eyebrow: string;
  children: React.ReactNode;
  description?: string;
}) {
  return (
    <div className={styles.heading}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h2>{children}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

export default function EcommercePage() {
  return (
    <main className={styles.page}>
      {/* HERO */}
      <section className={styles.hero} id="ecommerce-top">
        <div className={styles.heroGlow} aria-hidden="true" />

        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>
              NEXTWAVE BUILD / PROGRAMME 01
            </span>

            <h1>
              DON&apos;T JUST
              <br />
              LEARN
              <br />
              <span>E-COMMERCE.</span>
              <br />
              BUILD IT.
            </h1>

            <p>
              Learn how to research products, build an online store, understand
              digital marketing, and manage an e-commerce project through 12
              weeks of practical, mentor-led learning.
            </p>

            <div className={styles.heroActions}>
              <EnrollButton label="Start Your Journey" />

              <a href="#curriculum" className={styles.textLink}>
                Explore Curriculum <span>↘</span>
              </a>
            </div>

            <div className={styles.heroStats}>
              <div>
                <strong>12</strong>
                <span>WEEKS</span>
              </div>

              <div>
                <strong>LIVE</strong>
                <span>MENTOR GUIDANCE</span>
              </div>

              <div>
                <strong>01</strong>
                <span>REAL PROJECT</span>
              </div>
            </div>
          </div>

          <div className={styles.heroArt}>
            <div className={styles.heroCircle} aria-hidden="true" />

            <div className={styles.heroFrame}>
              <Image
                src="/assets/E-Commerce-Dropshipping.webp"
                alt="Illustration representing e-commerce and online store development"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 48vw"
                className={styles.heroImage}
              />
            </div>

            <div className={styles.heroSticker}>YOUR NEXT CHAPTER</div>

            <div className={styles.heroPlate}>
              <span>FEATURED PROGRAMME</span>
              <strong>
                E-COMMERCE
                <br />& DROPSHIPPING
              </strong>
            </div>
          </div>
        </div>

        <div className={styles.heroBottom}>
          <div className={styles.shell}>
            <span>LESS THEORY. MORE DOING.</span>
            <span>LEARN. PRACTISE. BUILD.</span>
            <a href="#overview">EXPLORE THE PROGRAMME ↓</a>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section id="overview" className={styles.intro}>
        <div className={`${styles.shell} ${styles.introGrid}`}>
          <Heading eyebrow="01 / THE PROGRAMME">
            FROM YOUR
            <br />
            FIRST IDEA
            <br />
            TO YOUR STORE.
          </Heading>

          <div className={styles.introContent}>
            <p className={styles.introLead}>
              E-commerce is more than selling products online. It is about
              building a complete digital business experience.
            </p>

            <p>
              Our programme introduces you to the foundations of e-commerce and
              dropshipping, from identifying products to creating your online
              storefront and understanding how digital marketing works.
            </p>

            <p>
              With practical lessons and live mentor guidance, you will develop
              the skills and confidence to complete your own e-commerce project.
            </p>

            <a href="#outcomes" className={styles.darkLink}>
              DISCOVER WHAT YOU&apos;LL LEARN ↗
            </a>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="outcomes" className={styles.skills}>
        <div className={styles.shell}>
          <Heading
            eyebrow="02 / PRACTICAL LEARNING"
            description="Develop the core skills needed to research, build, manage, and improve an online store."
          >
            WHAT YOU&apos;LL
            <br />
            LEARN.
          </Heading>

          <div className={styles.skillsGrid}>
            {outcomes.map((item) => (
              <article className={styles.skillCard} key={item.number}>
                <div className={styles.skillTop}>
                  <span>{item.number}.</span>
                  <span aria-hidden="true">↗</span>
                </div>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section id="curriculum" className={styles.curriculum}>
        <div className={styles.shell}>
          <div className={styles.curriculumHeading}>
            <Heading
              eyebrow="03 / THE LEARNING ROADMAP"
              description="A structured journey from understanding the fundamentals to developing and presenting your own online store."
            >
              YOUR 12-WEEK
              <br />
              JOURNEY.
            </Heading>

            <div className={styles.weekCount}>
              <strong>12</strong>
              <span>WEEKS TO BUILD</span>
            </div>
          </div>

          <div className={styles.roadmapGrid}>
            {roadmap.map((phase) => (
              <article className={styles.roadmapCard} key={phase.number}>
                <div className={styles.roadmapTop}>
                  <span>PHASE {phase.number}</span>
                  <strong>{phase.number}.</strong>
                </div>

                <span className={styles.roadmapWeeks}>{phase.weeks}</span>

                <h3>{phase.title}</h3>
                <p>{phase.description}</p>

                <div className={styles.topicList}>
                  {phase.topics.map((topic) => (
                    <div key={topic}>
                      <span aria-hidden="true">↗</span>
                      {topic}
                    </div>
                  ))}
                </div>

                <div className={styles.milestone}>
                  <span>PROJECT MILESTONE</span>
                  <strong>{phase.project}</strong>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.curriculumFooter}>
            <p>
              Every phase brings you closer to completing a practical project
              you can share and demonstrate.
            </p>

            <EnrollButton label="Enroll in This Programme" />
          </div>
        </div>
      </section>

      {/* LEARNING METHOD */}
      <section className={styles.method}>
        <div className={styles.shell}>
          <Heading eyebrow="04 / THE LEARNING EXPERIENCE">
            FROM LESSON
            <br />
            TO LAUNCH.
          </Heading>

          <div className={styles.methodTrack}>
            {learningSteps.map((step) => (
              <article className={styles.methodCard} key={step.number}>
                <span className={styles.methodNumber}>{step.number}</span>

                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT */}
      <section className={styles.project}>
        <div className={`${styles.shell} ${styles.projectGrid}`}>
          <div className={styles.projectVisual}>
            <div className={styles.projectVisualLabel}>
              <span>YOUR PRACTICAL PROJECT</span>
              <span>001 / BUILD</span>
            </div>

            <div className={styles.projectImageWrap}>
              <Image
                src="/assets/E-Commerce-Dropshipping.webp"
                alt="E-commerce store project illustration"
                fill
                sizes="(max-width: 768px) 90vw, 43vw"
                className={styles.projectImage}
              />
            </div>

            <span className={styles.projectBadge}>IDEAS INTO PROJECTS ↗</span>
          </div>

          <div className={styles.projectCopy}>
            <Heading
              eyebrow="05 / BUILD SOMETHING REAL"
              description="Don't just watch someone create an online store. Build your own practical project with support along the way."
            >
              YOUR STORE.
              <br />
              YOUR PROJECT.
              <br />
              YOUR PROGRESS.
            </Heading>

            <div className={styles.projectSteps}>
              {projectSteps.map((step, index) => (
                <div key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>

            <EnrollButton label="Start Building" />
          </div>
        </div>
      </section>

      {/* MENTORSHIP */}
      <section id="mentorship" className={styles.mentorship}>
        <div className={styles.shell}>
          <div className={styles.mentorIntro}>
            <Heading
              eyebrow="06 / LIVE MENTORSHIP"
              description="Your mentor helps you understand the lessons, practise skills, build your project, and identify areas for improvement."
            >
              YOU&apos;RE NOT
              <br />
              LEARNING ALONE.
            </Heading>

            <div className={styles.mentorHighlight}>
              <strong>REAL GUIDANCE.</strong>
              <span>REAL PROJECTS.</span>
            </div>
          </div>

          <div className={styles.mentorGrid}>
            {mentorBenefits.map((item) => (
              <article className={styles.mentorCard} key={item.number}>
                <span className={styles.mentorNumber}>{item.number}.</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IS IT FOR */}
      <section className={styles.audience}>
        <div className={`${styles.shell} ${styles.audienceGrid}`}>
          <Heading
            eyebrow="07 / WHO SHOULD JOIN?"
            description="No previous e-commerce experience is required to begin learning."
          >
            BUILT FOR
            <br />
            AMBITIOUS
            <br />
            BEGINNERS.
          </Heading>

          <div className={styles.audienceList}>
            {audience.map((item, index) => (
              <div key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
                <span aria-hidden="true">↗</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={styles.faq}>
        <div className={`${styles.shell} ${styles.faqGrid}`}>
          <div className={styles.faqIntro}>
            <Heading eyebrow="08 / FREQUENTLY ASKED QUESTIONS">
              GOT
              <br />
              QUESTIONS?
            </Heading>

            <p>Explore answers to some common questions about the programme.</p>

            <EnrollButton label="Start Registration" outline />
          </div>

          <div className={styles.faqList}>
            {faqs.map((faq, index) => (
              <details className={styles.faqItem} key={faq.question}>
                <summary>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{faq.question}</strong>
                  <span className={styles.faqPlus}>+</span>
                </summary>

                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <div className={`${styles.shell} ${styles.finalGrid}`}>
          <div>
            <span className={styles.eyebrow}>WHAT WILL YOU BUILD NEXT?</span>

            <h2>
              YOUR NEXT
              <br />
              MOVE STARTS
              <br />
              HERE.
            </h2>

            <p>
              Join the 12-week E-Commerce & Dropshipping programme and start
              developing practical online business skills.
            </p>
          </div>

          <a href={ENROLL_URL} className={styles.finalButton}>
            ENROLL NOW <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </main>
  );
}
