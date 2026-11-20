import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Online Freelancing Course | NextWave Build",

  description:
    "Learn freelancing, client communication, portfolio building and proposal writing through practical online training with mentor guidance at NextWave Build.",

  alternates: {
    canonical: "https://nextwavebuild.com/programmes/freelancing-online-work",
  },

  openGraph: {
    title: "Online Freelancing Course | NextWave Build",
    description:
      "Learn freelancing, client communication, portfolio building and proposal writing through practical online training with mentor guidance at NextWave Build.",
    url: "https://nextwavebuild.com/programmes/freelancing-online-work",
    siteName: "NextWave Build",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Online Freelancing Course | NextWave Build",
    description:
      "Learn freelancing, client communication, portfolio building and proposal writing through practical online training with mentor guidance at NextWave Build.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

const ENROLL_URL =
  "https://portal.nextwavebuild.com/register?flagship=FREELANCING";

const skills = [
  {
    number: "01",
    title: "Discover Your Skills",
    description:
      "Explore digital services, identify your strengths, and understand how freelancers create value for clients.",
  },
  {
    number: "02",
    title: "Find Your Niche",
    description:
      "Learn about target clients, market research, service positioning, and defining what you can offer.",
  },
  {
    number: "03",
    title: "Build a Portfolio",
    description:
      "Create sample projects and present your work in a clear, professional portfolio.",
  },
  {
    number: "04",
    title: "Profiles & Proposals",
    description:
      "Understand freelancing platforms and practise writing clear, tailored project proposals.",
  },
  {
    number: "05",
    title: "Client Communication",
    description:
      "Practise project discovery, timelines, feedback, professional communication, and expectations.",
  },
  {
    number: "06",
    title: "Manage Your Work",
    description:
      "Explore project planning, delivery, revisions, pricing principles, and building repeatable workflows.",
  },
];

const phases = [
  {
    number: "01",
    weeks: "WEEKS 01–03",
    title: "Discover & Position",
    description:
      "Understand freelancing, explore services, and decide which skills you want to develop.",
    topics: [
      "Freelancing fundamentals",
      "Skills and niche selection",
      "Understanding client needs",
      "Service positioning and research",
    ],
    milestone: "Your service idea and learning plan",
  },
  {
    number: "02",
    weeks: "WEEKS 04–06",
    title: "Create & Showcase",
    description:
      "Build evidence of your skills and learn how to present yourself professionally.",
    topics: [
      "Portfolio planning",
      "Sample project development",
      "Professional profile setup",
      "Presenting your work clearly",
    ],
    milestone: "Your first portfolio and sample project",
  },
  {
    number: "03",
    weeks: "WEEKS 07–09",
    title: "Pitch & Communicate",
    description:
      "Practise the communication skills used to approach and work with clients.",
    topics: [
      "Understanding project briefs",
      "Proposal and pitch writing",
      "Client conversations",
      "Pricing and scope fundamentals",
    ],
    milestone: "Your sample proposals and client brief",
  },
  {
    number: "04",
    weeks: "WEEKS 10–12",
    title: "Deliver & Improve",
    description:
      "Complete a client-style assignment, refine your portfolio, and review your next steps.",
    topics: [
      "Project planning and delivery",
      "Managing feedback and revisions",
      "Final portfolio improvements",
      "Mentor review and presentation",
    ],
    milestone: "Your completed client-style project",
  },
];

const method = [
  {
    number: "01.",
    title: "Learn the Foundations",
    description:
      "Understand how freelancers find opportunities, communicate, and deliver work.",
  },
  {
    number: "02.",
    title: "Practise the Skills",
    description:
      "Try real-world exercises such as writing proposals and responding to project briefs.",
  },
  {
    number: "03.",
    title: "Build Your Portfolio",
    description:
      "Create examples of your work and develop a professional project showcase.",
  },
  {
    number: "04.",
    title: "Get Mentor Feedback",
    description:
      "Review your portfolio and assignments with a mentor and improve them.",
  },
];

const projectSteps = [
  "Choose a service and describe your ideal client.",
  "Complete a realistic sample assignment.",
  "Build a portfolio that presents your work.",
  "Write a tailored proposal for a sample client brief.",
  "Refine your portfolio and project using mentor feedback.",
];

const mentorBenefits = [
  {
    number: "01",
    title: "Live Guidance",
    description:
      "Learn freelancing skills through live mentor-led sessions covering client communication, practical workflows and useful tools.",
  },
  {
    number: "02",
    title: "Practical Assignments",
    description:
      "Work on realistic freelance client briefs, project proposals and portfolio assignments with structured mentor support.",
  },
  {
    number: "03",
    title: "Personal Feedback",
    description:
      "Receive constructive mentor feedback to improve your freelance projects, portfolio presentation and client communication.",
  },
];

const audience = [
  "Complete beginners",
  "Students & graduates",
  "Aspiring freelancers",
  "Career changers",
  "Working professionals",
  "Anyone exploring remote work",
];

const faqs = [
  {
    question: "Do I need previous freelancing experience to join?",
    answer:
      "No previous freelancing experience is needed if you are starting as a beginner. The programme introduces essential freelance skills, including choosing services, creating sample work, developing a portfolio and learning how to communicate with potential clients.",
  },
  {
    question: "How long is the Freelancing & Online Work programme?",
    answer:
      "The programme is designed around 12 weeks of practical learning. During this period, you explore freelancing fundamentals, complete guided assignments, build portfolio projects and receive mentor feedback.",
  },
  {
    question: "Will I build my own freelance portfolio?",
    answer:
      "The programme includes portfolio-building activities where you create sample projects, present your work professionally and practise showcasing your skills to potential freelance clients.",
  },
  {
    question: "Will I learn how to write freelance proposals?",
    answer:
      "YYes. You will practise preparing clear, tailored proposals based on sample client briefs. The learning activities cover understanding client needs, presenting your services and communicating your approach professionally.",
  },
  {
    question: "Are the freelancing classes live or pre-recorded?",
    answer:
      "The programme includes live, mentor-led learning sessions and guided practical assignments. Confirm the current class schedule and any recorded lesson access with NextWave Build before enrolling.",
  },
  {
    question: "Will I be guaranteed freelance clients or income?",
    answer:
      "No. The programme focuses on developing practical freelance skills, building a portfolio and preparing for client work. Getting clients or earning income depends on your abilities, effort, market demand and other factors, so specific results are not guaranteed.",
  },
  {
    question: "How can I enroll in the freelancing course?",
    answer:
      "Use the Start Registration button on the programme page to begin the enrollment process. Review the available course details, fees and schedule before completing your registration.",
  },
  {
    question: "How much does the Freelancing & Online Work programme cost?",
    answer:
      "The Freelancing & Online Work programme at NextWave Build costs $499 USD. This programme is designed to help you develop practical freelancing skills through structured online learning, hands-on projects, and mentor guidance.",
  },
];

function Heading({
  eyebrow,
  children,
  description,
}: {
  eyebrow: string;
  children: ReactNode;
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
      className={`${styles.button} ${outline ? styles.buttonOutline : styles.buttonAcid}`}
    >
      {label}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export default function FreelancingPage() {
  return (
    <main className={styles.page}>
      {/* Existing Header and Footer are supplied by src/app/programmes/layout.tsx */}
      <section className={styles.hero} id="freelancing-top">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>
              Freelancing Course Online | Build Skills with NextWave
            </span>
            <h1>
              DON&apos;T JUST
              <br />
              LEARN A SKILL.
              <br />
              <span>BUILD YOUR</span>
              <br />
              FUTURE.
            </h1>
            <p>
              Learn freelancing, client communication, portfolio building and
              proposal writing through practical mentor-led online training.
            </p>
            <div className={styles.heroActions}>
              <EnrollButton label="Start Your Journey" />
              <a className={styles.textLink} href="#curriculum">
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
                <span>PORTFOLIO PROJECT</span>
              </div>
            </div>
          </div>
          <div className={styles.heroArt}>
            <Image
              src="/assets/Freelancing_Course.webp"
              alt="Freelancing and Online Work learning programme with live mentor guidance"
              width={1536}
              height={1024}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.freelancingHeroImage}
            />
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

      <section id="overview" className={styles.intro}>
        <div className={`${styles.shell} ${styles.introGrid}`}>
          <Heading eyebrow="01 / THE PROGRAMME">
            FROM SKILLS
            <br />
            TO REAL
            <br />
            PROJECTS.
          </Heading>
          <div className={styles.introContent}>
            <h3 className={styles.introLead}>
              Learn Practical Freelancing Skills and Build Your Portfolio
            </h3>
            <p>
              Our online freelancing course helps beginners develop practical
              skills for working with clients. Learn how to explore freelance
              services, build a professional portfolio, communicate with clients
              and prepare effective project proposals.
            </p>
            <p>
              Through hands-on assignments, real-world projects and mentor
              feedback, you&apos;ll practise your skills, create sample work and
              build confidence in offering your services online.
            </p>
            <a href="#skills" className={styles.darkLink}>
              DISCOVER WHAT YOU&apos;LL LEARN ↗
            </a>
          </div>
        </div>
      </section>

      <section id="skills" className={styles.skills}>
        <div className={styles.shell}>
          <Heading
            eyebrow="02 / PRACTICAL LEARNING"
            description="Discover the practical freelancing skills you'll develop in this course, from choosing a freelance niche and building a professional portfolio to writing client proposals, communicating effectively and managing freelance projects. Each learning area helps you prepare for real-world freelance work."
          >
            WHAT YOU&apos;LL
            <br />
            LEARN.
          </Heading>
          <div className={styles.skillsGrid}>
            {skills.map((item) => (
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

      <section id="curriculum" className={styles.curriculum}>
        <div className={styles.shell}>
          <div className={styles.curriculumHeading}>
            <Heading
              eyebrow="03 / THE LEARNING ROADMAP"
              description="Four practical phases that move from exploring your services to presenting your completed project."
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
            {phases.map((phase) => (
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
                  <strong>{phase.milestone}</strong>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.curriculumFooter}>
            <p>
              Each phase helps you develop practical work you can include in
              your professional portfolio.
            </p>
            <EnrollButton label="Enroll in This Programme" />
          </div>
        </div>
      </section>

      <section className={styles.method} id="learning-method">
        <div className={styles.shell}>
          <Heading eyebrow="04 / THE LEARNING EXPERIENCE">
            FROM LESSON
            <br />
            TO OPPORTUNITY.
          </Heading>
          <div className={styles.methodTrack}>
            {method.map((step) => (
              <article key={step.number} className={styles.methodCard}>
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

      <section className={styles.project} id="portfolio-project">
        <div className={`${styles.shell} ${styles.projectGrid}`}>
          <div className={styles.projectVisual}>
            <div className={styles.projectVisualLabel}>
              <span>YOUR PRACTICAL PROJECT</span>
              <span>002 / CREATE</span>
            </div>
            <div className={styles.projectImageWrap}>
              <Image
                src="/assets/FREELANCER.webp"
                alt="Freelancing and portfolio project illustration"
                fill
                sizes="(max-width: 768px) 90vw, 43vw"
                className={styles.projectImage}
              />
            </div>
            <span className={styles.projectBadge}>
              Freelancing course practical project showing online portfolio and
              sample client work
            </span>
          </div>
          <div className={styles.projectCopy}>
            <Heading
              eyebrow="05 / BUILD SOMETHING REAL"
              description="create sample work for potential clients and build a professional portfolio. With mentor guidance, you'll practise preparing client proposals and improving your work through feedback."
            >
              YOUR SKILLS.
              <br />
              YOUR WORK.
              <br />
              YOUR PORTFOLIO.
            </Heading>
            <div className={styles.projectSteps}>
              {projectSteps.map((step, i) => (
                <div key={step}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
            <EnrollButton label="Start Building" />
          </div>
        </div>
      </section>

      <section id="mentorship" className={styles.mentorship}>
        <div className={styles.shell}>
          <div className={styles.mentorIntro}>
            <Heading
              eyebrow="06 / LIVE MENTORSHIP"
              description="Learn with guidance as you practise client-style work, develop your portfolio, and improve your presentation."
            >
              YOU&apos;RE NOT
              <br />
              LEARNING ALONE.
            </Heading>
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

      <section className={styles.audience}>
        <div className={`${styles.shell} ${styles.audienceGrid}`}>
          <Heading
            eyebrow="07 / WHO SHOULD JOIN?"
            description="Our beginner-friendly online freelancing course is designed for students, graduates, aspiring freelancers, career changers and professionals who want to develop practical digital skills. Whether you're starting from scratch or exploring remote work opportunities, you'll learn how to build a portfolio, communicate with clients and prepare for freelance projects."
          >
            BUILT FOR
            <br />
            THE NEXT
            <br />
            GENERATION.
          </Heading>
          <div className={styles.audienceList}>
            {audience.map((item, i) => (
              <div key={item}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
                <span aria-hidden="true">↗</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className={styles.faq}>
        <div className={`${styles.shell} ${styles.faqGrid}`}>
          <div className={styles.faqIntro}>
            <Heading eyebrow="08 / FREQUENTLY ASKED QUESTIONS">
              GOT
              <br />
              QUESTIONS?
            </Heading>
            <p>
              Find answers to frequently asked questions about NextWave Build’s
              **Freelancing & Online Work programme**. Explore course fees,
              beginner-friendly online training, practical freelancing skills,
              real-world projects, mentor guidance, and how the programme helps
              you prepare for online work opportunities.
            </p>
            <EnrollButton label="Start Registration" outline />
          </div>
          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <details className={styles.faqItem} key={faq.question}>
                <summary>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <strong>{faq.question}</strong>
                  <span className={styles.faqPlus}>+</span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

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
              Join the 12-week Freelancing & Online Work programme and begin
              developing practical skills, a portfolio, and professional
              confidence.
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
