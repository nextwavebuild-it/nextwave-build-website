import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Technology & AI Programme | NextWave Build",
  description:
    "Explore practical technology and AI skills in a 12-week mentor-led programme. Learn useful AI tools, prompt writing, automation fundamentals, and build your own AI project.",
  alternates: { canonical: "/programmes/technology-ai" },
  openGraph: {
    title: "Technology & AI | NextWave Build",
    description:
      "Don't just explore AI. Learn practical skills and build a project with live mentor guidance.",
    type: "website",
  },
};

const ENROLL_URL = "https://portal.nextwavebuild.com/register?flagship=AI";

const outcomes = [
  {
    number: "01",
    title: "Technology Foundations",
    description:
      "Explore the key digital concepts and tools behind modern technology and AI-powered workflows.",
  },
  {
    number: "02",
    title: "AI Tools & Applications",
    description:
      "Discover useful AI tools and understand where they can support everyday work and creative projects.",
  },
  {
    number: "03",
    title: "Prompt Writing",
    description:
      "Practise writing clear instructions, refining outputs, and evaluating AI-generated responses.",
  },
  {
    number: "04",
    title: "Automation Concepts",
    description:
      "Learn how repetitive tasks can be organized into simple workflows using appropriate tools.",
  },
  {
    number: "05",
    title: "Problem Solving with AI",
    description:
      "Apply AI thoughtfully to research, planning, content, analysis, and other practical scenarios.",
  },
  {
    number: "06",
    title: "Build an AI Project",
    description:
      "Plan, develop, test, and present a practical technology or AI-powered project with mentor feedback.",
  },
];

const roadmap = [
  {
    number: "01",
    weeks: "WEEKS 01–03",
    title: "Explore & Understand",
    description:
      "Build your foundation in technology, AI concepts, and responsible use.",
    topics: [
      "Digital and AI fundamentals",
      "How modern AI tools work",
      "Identifying useful applications",
      "Responsible use and verification",
    ],
    project: "Define a useful problem to solve with technology or AI.",
  },
  {
    number: "02",
    weeks: "WEEKS 04–06",
    title: "Practise & Create",
    description:
      "Learn to communicate with AI tools and apply them in guided tasks.",
    topics: [
      "Prompt-writing techniques",
      "Working with AI outputs",
      "Research and content workflows",
      "Hands-on tool exercises",
    ],
    project: "Build a collection of practical AI-assisted workflows.",
  },
  {
    number: "03",
    weeks: "WEEKS 07–09",
    title: "Design & Build",
    description:
      "Turn your project idea into a structured solution with mentor support.",
    topics: [
      "Workflow and automation basics",
      "Project planning and prototyping",
      "Testing and iteration",
      "Privacy and quality checks",
    ],
    project: "Develop a working prototype of your AI project.",
  },
  {
    number: "04",
    weeks: "WEEKS 10–12",
    title: "Refine & Present",
    description:
      "Improve your solution, document your process, and present what you learned.",
    topics: [
      "Reviewing project results",
      "Improving usability and outputs",
      "Project documentation",
      "Mentor review and presentation",
    ],
    project: "Present your completed technology or AI-based project.",
  },
];

const learningSteps = [
  {
    number: "01.",
    title: "Learn the Foundations",
    description:
      "Understand technology concepts, AI tools, and how to use them responsibly.",
  },
  {
    number: "02.",
    title: "Practise the Skills",
    description:
      "Work through guided exercises involving prompting, research, and workflows.",
  },
  {
    number: "03.",
    title: "Build Your Project",
    description:
      "Apply your new skills to a real technology or AI-based project.",
  },
  {
    number: "04.",
    title: "Get Mentor Feedback",
    description:
      "Review your work, solve problems, and improve your project step by step.",
  },
];

const projectSteps = [
  "Identify a practical problem worth solving.",
  "Select the tools and plan your approach.",
  "Create prompts, workflows, or a simple prototype.",
  "Test results, verify accuracy, and refine your work.",
  "Present your project and receive mentor feedback.",
];

const mentorBenefits = [
  {
    number: "01",
    title: "Live Learning Sessions",
    description:
      "Explore concepts and tools with a mentor through practical, guided learning.",
  },
  {
    number: "02",
    title: "Hands-On Project Support",
    description:
      "Work through challenges and develop your project with structured guidance.",
  },
  {
    number: "03",
    title: "Constructive Feedback",
    description:
      "Get useful feedback on your workflows, outputs, and final project.",
  },
];

const audience = [
  "Complete beginners",
  "Students & fresh graduates",
  "Working professionals",
  "Aspiring digital creators",
  "Freelancers & entrepreneurs",
  "Curious technology learners",
];

const faqs = [
  {
    question: "Do I need a technical background?",
    answer:
      "No. The programme introduces the foundations first and gradually progresses to practical exercises and a project. Previous coding or AI experience is not required to begin.",
  },
  {
    question: "How long is the programme?",
    answer:
      "The Technology & AI programme lasts 12 weeks, with learning activities and practical project milestones across four phases.",
  },
  {
    question: "Will I learn to use AI tools?",
    answer:
      "Yes. You will explore useful AI tools, prompt-writing techniques, and ways to apply AI to real tasks. Specific tools may change as technology evolves.",
  },
  {
    question: "Will I build my own project?",
    answer:
      "Yes. You will plan and develop a practical technology or AI-based project and refine it using mentor feedback.",
  },
  {
    question: "Are the sessions mentor-led?",
    answer:
      "The programme is designed around live mentor-led learning, guided exercises, project support, and feedback.",
  },
  {
    question: "Do I need to buy paid AI subscriptions?",
    answer:
      "Many exercises can be explored using accessible tools. Some third-party products may have paid plans or usage limits; any required external costs should be confirmed before enrollment.",
  },
  {
    question: "Does completing the programme guarantee a job?",
    answer:
      "No. The goal is to build practical skills and a demonstrable project. Employment and income outcomes are not guaranteed.",
  },
  {
    question: "How can I register?",
    answer:
      "Select Enroll Now to open the NextWave Build registration application with the AI programme selected where supported.",
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
      className={`${styles.button} ${outline ? styles.buttonOutline : styles.buttonAcid}`}
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

export default function TechnologyAIPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} id="technology-top">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>
              NEXTWAVE BUILD / PROGRAMME 03
            </span>
            <h1>
              DON&apos;T JUST
              <br />
              EXPLORE
              <br />
              <span>AI.</span>
              <br />
              BUILD WITH IT.
            </h1>
            <p>
              Learn practical technology and AI skills, explore useful tools,
              create smarter workflows, and bring your ideas to life through 12
              weeks of live, mentor-led learning.
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
                <span>AI PROJECT</span>
              </div>
            </div>
          </div>
          <div className={styles.heroArt}>
            <div className={styles.heroCircle} aria-hidden="true" />
            <div className={styles.heroFrame}>
              <Image
                src="/assets/AI-Learning-Workspace.webp"
                alt="Illustration of a technology and AI learning workspace"
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
                TECHNOLOGY
                <br />& AI
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
            FROM
            <br />
            CURIOSITY
            <br />
            TO CREATION.
          </Heading>
          <div className={styles.introContent}>
            <p className={styles.introLead}>
              Technology and AI become more useful when you know how to apply
              them.
            </p>
            <p>
              NextWave Build introduces practical technology fundamentals,
              helpful AI tools, clear prompt writing, workflow design, and
              responsible use through activities you can try yourself.
            </p>
            <p>
              Rather than only watching lessons, you will work toward a
              practical project with live mentor guidance and constructive
              feedback.
            </p>
            <a href="#outcomes" className={styles.darkLink}>
              DISCOVER WHAT YOU&apos;LL LEARN ↗
            </a>
          </div>
        </div>
      </section>

      <section id="outcomes" className={styles.skills}>
        <div className={styles.shell}>
          <Heading
            eyebrow="02 / PRACTICAL LEARNING"
            description="Develop useful technology skills and learn how to apply AI thoughtfully to real tasks and projects."
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

      <section id="curriculum" className={styles.curriculum}>
        <div className={styles.shell}>
          <div className={styles.curriculumHeading}>
            <Heading
              eyebrow="03 / THE LEARNING ROADMAP"
              description="Four practical phases that take you from the basics to a completed technology or AI project."
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
              Build your confidence phase by phase, then show what you created
              and how you improved it.
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
            TO CREATION.
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

      <section className={styles.project} id="project">
        <div className={`${styles.shell} ${styles.projectGrid}`}>
          <div className={styles.projectVisual}>
            <div className={styles.projectVisualLabel}>
              <span>YOUR PRACTICAL PROJECT</span>
              <span>003 / BUILD</span>
            </div>
            <div className={styles.projectImageWrap}>
              <Image
                src="/assets/AI-Learning-Workspace.webp"
                alt="Illustration representing an AI project workspace"
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
              description="Turn a useful idea into a technology or AI-based project you can explain, demonstrate, and improve."
            >
              YOUR IDEA.
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

      <section id="mentorship" className={styles.mentorship}>
        <div className={styles.shell}>
          <div className={styles.mentorIntro}>
            <Heading
              eyebrow="06 / LIVE MENTORSHIP"
              description="Learn with mentors who explain concepts, guide hands-on tasks, and provide feedback as your project develops."
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
            description="A practical starting point for curious learners, with no previous AI or programming experience required."
          >
            BUILT FOR
            <br />
            CURIOUS
            <br />
            MINDS.
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

      <section id="faq" className={styles.faq}>
        <div className={`${styles.shell} ${styles.faqGrid}`}>
          <div className={styles.faqIntro}>
            <Heading eyebrow="08 / FREQUENTLY ASKED QUESTIONS">
              GOT
              <br />
              QUESTIONS?
            </Heading>
            <p>Find answers about the Technology & AI learning experience.</p>
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
              Join the 12-week Technology & AI programme and start building
              practical digital skills.
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
