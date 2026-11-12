import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Freelancing & Online Work | NextWave Build",
  description:
    "Build practical freelancing skills in 12 weeks. Develop a portfolio, practise proposals and client communication, and learn with live NextWave Build mentors.",
  alternates: { canonical: "/programmes/freelancing-online-work" },
  openGraph: {
    title: "Freelancing & Online Work | NextWave Build",
    description:
      "Learn the skills. Build your portfolio. Practise real client-style work with mentor guidance.",
    type: "website",
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
      "Learn through mentor-led sessions that explain skills, workflows, and useful tools.",
  },
  {
    number: "02",
    title: "Practical Assignments",
    description:
      "Work on client-style briefs, proposals, and portfolio projects with support.",
  },
  {
    number: "03",
    title: "Personal Feedback",
    description:
      "Understand how to improve your work, presentation, and communication.",
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
    question: "Do I need freelancing experience?",
    answer:
      "No. The programme starts with the fundamentals and progresses through practical assignments, portfolio building, and communication skills.",
  },
  {
    question: "How long is the programme?",
    answer:
      "The Freelancing & Online Work programme is structured over 12 weeks, with practical learning and mentor guidance.",
  },
  {
    question: "Will I create my own portfolio?",
    answer:
      "Yes. You will work on sample projects and develop a portfolio that demonstrates the skills you practise during the programme.",
  },
  {
    question: "Will I learn how to write proposals?",
    answer:
      "Yes. The learning roadmap includes interpreting project briefs, writing proposals, and practising client communication.",
  },
  {
    question: "Are the sessions live?",
    answer:
      "The programme is designed around live mentor-led learning, practice activities, and project feedback.",
  },
  {
    question: "Will I be guaranteed freelance clients or income?",
    answer:
      "No. The programme teaches practical skills; finding clients and earning income depend on your skills, effort, market conditions, and other factors.",
  },
  {
    question: "How do I enroll?",
    answer:
      "Select Enroll Now to open the NextWave Build registration application with the Freelancing programme selected, if supported by the registration form.",
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
              NEXTWAVE BUILD / PROGRAMME 02
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
              Learn how to turn your abilities into professional services. Build
              a portfolio, practise client-style assignments, and develop
              practical freelancing skills through 12 weeks of mentor-led
              learning.
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
            <div className={styles.heroCircle} aria-hidden="true" />
            <div className={styles.heroFrame}>
              <Image
                src="/assets/FREELANCER.webp"
                alt="Illustration of a freelancing portfolio and online work"
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
                FREELANCING
                <br />& ONLINE WORK
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
            <p className={styles.introLead}>
              Freelancing is more than creating a profile. It&apos;s about
              delivering value through your work.
            </p>
            <p>
              Our programme helps you explore online services, build sample
              work, create your portfolio, and understand the communication
              skills involved in working with clients.
            </p>
            <p>
              Instead of just watching lessons, you&apos;ll practise on
              assignments, complete a project, and refine your work with mentor
              feedback.
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
            description="Explore the skills needed to present your work, communicate professionally, and manage freelance projects."
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
              BUILD WORK YOU CAN SHOW ↗
            </span>
          </div>
          <div className={styles.projectCopy}>
            <Heading
              eyebrow="05 / BUILD SOMETHING REAL"
              description="You won't just hear about freelancing. You'll practise the process and create work that demonstrates your skills."
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

      <section className={styles.audience}>
        <div className={`${styles.shell} ${styles.audienceGrid}`}>
          <Heading
            eyebrow="07 / WHO SHOULD JOIN?"
            description="A beginner-friendly learning path for people who want to explore professional online work."
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
              Find answers about the programme, practical projects, and
              registration.
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
