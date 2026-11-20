import Image from "next/image";

export default function WhyNextWave() {
  return (
    <section className="manifesto" id="why">
      <div className="manifesto-art">
        <div className="corner">NEXTWAVE / MADE TO BUILD</div>

        {/* Actual NextWave Build brand logo */}
        <div className="manifesto-logo">
          <Image
            src="/assets/made-to-build-logo.png"
            alt="NextWave Build logo"
            width={2048}
            height={2048}
            sizes="(max-width: 768px) 240px, 360px"
            className="manifesto-logo-image"
          />
        </div>
      </div>

      <div className="manifesto-copy reveal">
        <span className="eyebrow">Built differently</span>

        {/* Main section heading - H2 */}
        <h2>
          Knowledge
          <br />
          is the start.
          <br />
          <span style={{ color: "var(--acid)" }}>Doing</span> is
          <br />
          the point.
        </h2>

        {/* SEO-optimized introduction */}
        <p>
          NextWave Build helps you develop practical digital skills through
          hands-on learning, real-world projects and mentor guidance. Explore
          technology and AI, e-commerce and dropshipping, and freelancing
          through structured online training designed to turn knowledge into
          practical abilities.
        </p>

        {/* Feature cards */}
        <div className="manifesto-points">
          {/* Feature Card 01 */}
          <div>
            <h3>
              <span>01</span> ↗ PRACTICAL LEARNING
            </h3>
            <p>
              Apply new digital skills through structured lessons, guided
              exercises and hands-on training.
            </p>
          </div>

          {/* Feature Card 02 */}
          <div>
            <h3>
              <span>02</span> ↗ REAL PROJECTS
            </h3>
            <p>
              Build practical projects in AI, e-commerce and freelancing to
              demonstrate what you learn.
            </p>
          </div>

          {/* Feature Card 03 */}
          <div>
            <h3>
              <span>03</span> ↗ MENTOR SUPPORT
            </h3>
            <p>
              Get mentor guidance, constructive feedback and clear direction
              throughout your learning journey.
            </p>
          </div>

          {/* Feature Card 04 */}
          <div>
            <h3>
              <span>04</span> ↗ A WELCOMING PATH
            </h3>
            <p>
              Start learning new digital skills with beginner-friendly
              programmes and structured guidance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
