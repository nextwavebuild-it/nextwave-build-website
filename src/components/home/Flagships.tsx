import Image from "next/image";

const programmes = [
  {
    number: "01",
    title: "E-Commerce & Dropshipping",
    description:
      "Learn how to launch and manage an online store through live, mentor-led sessions. Understand product research, store setup, supplier selection, marketing fundamentals and order management. Build your own practice store with guidance from your mentor, then receive feedback to improve it.",
    image: "/assets/E-Commerce-Dropshipping.webp",
    alt: "Online store illustration",
    price: "$499",
  },
  {
    number: "02",
    title: "Freelancing & Online Work",
    description:
      "Learn how to turn your skills into services through live mentor-led training. Explore freelancing platforms, building a professional portfolio, writing proposals, communicating with clients and managing projects. Create your own portfolio and practise client-style assignments, with constructive feedback from your mentor.",
    image: "/assets/FREELANCER.webp",
    alt: "Creative portfolio illustration",
    price: "$499",
  },
  {
    number: "03",
    title: "Technology & AI",
    description:
      "Discover practical technology and AI skills through interactive, mentor-led sessions. Learn technology fundamentals, useful AI tools, prompt writing, automation concepts and practical applications. Work on your own technology or AI-based project while your mentor provides guidance, troubleshooting support and feedback.",
    image: "/assets/AI-Learning-Workspace.webp",
    alt: "Technology project illustration",
    price: "$799",
  },
];

export default function Flagships() {
  return (
    <section className="section" id="flagships">
      <div className="shell">
        <div className="heading-line reveal">
          <div>
            <span className="eyebrow">Make your move</span>
            <h2>
              Choose your
              <br />
              program.
            </h2>
          </div>
        </div>

        <div className="program-list">
          {programmes.map((programme) => (
            <a
              key={programme.number}
              href="https://portal.nextwavebuild.com/register"
              className="program reveal"
              aria-label={`${programme.title} — ${programme.price} USD`}
            >
              <span className="pr-num">{programme.number}</span>

              <div className="pr-content">
                <h3>{programme.title}</h3>
                <p>{programme.description}</p>
              </div>

              <div className="pr-visual">
                <div className="pr-image">
                  <Image
                    src={programme.image}
                    alt={programme.alt}
                    width={720}
                    height={405}
                    sizes="(max-width: 768px) 100vw, 360px"
                    loading="lazy"
                  />
                </div>

                <div className="pr-price-tag" aria-hidden="true">
                  <span className="pr-price-label">PROGRAMME FEE</span>

                  <strong className="pr-price-value">{programme.price}</strong>

                  <span className="pr-price-currency">USD</span>

                  <span className="pr-price-caption">ONE-TIME PAYMENT</span>
                </div>
              </div>

              <span className="go" aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
