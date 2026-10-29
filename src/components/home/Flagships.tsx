import Image from "next/image";

const programmes = [
  {
    number: "01",
    title: "E-Commerce & Dropshipping",
    description:
      "Learn how online stores work, then build a practice store of your own.",
    image: "/assets/E-Commerce-Dropshipping.webp",
    alt: "Online store illustration",
    price: "$400",
  },
  {
    number: "02",
    title: "Freelancing & Online Work",
    description:
      "Turn a skill into a service, with a portfolio and proposals to match.",
    image: "/assets/FREELANCER.webp",
    alt: "Creative portfolio illustration",
    price: "$499",
  },
  {
    number: "03",
    title: "Technology & AI",
    description:
      "Learn tech foundations and practical ways to use AI in real projects.",
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
