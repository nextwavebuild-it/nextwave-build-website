export default function Method() {
  const steps = [
    {
      number: "01.",
      title: "Learn the Foundations",
      description:
        "Short, clear lessons cover the core ideas and tools you need.",
    },
    {
      number: "02.",
      title: "Practise the Skills",
      description:
        "Guided exercises help you try each skill until it feels natural.",
    },
    {
      number: "03.",
      title: "Build YOUR Project",
      description:
        "Bring it together in a real project you plan, create, and can share.",
    },
    {
      number: "04.",
      title: "Get Mentor Feedback",
      description: "A mentor reviews your work and suggests clear next steps.",
    },
  ];

  return (
    <section className="method section" id="how-it-works">
      <div className="shell">
        <div className="heading-line reveal">
          <div>
            <span className="eyebrow">The Learning Experience</span>

            <h2>
              From Lesson
              <br />
              To Launch.
            </h2>
          </div>
        </div>

        <div className="method-track">
          {steps.map((step) => (
            <div className="method-box reveal" key={step.number}>
              <span className="num">{step.number}</span>

              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
