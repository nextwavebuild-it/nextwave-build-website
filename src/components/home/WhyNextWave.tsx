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

        <h2>
          Knowledge
          <br />
          is the start.
          <br />
          <span style={{ color: "var(--acid)" }}>Doing</span> is
          <br />
          the point.
        </h2>

        <p>
          NextWave Build is designed around one idea: skills grow when you use
          them. Every program moves you from understanding something to actually
          making it.
        </p>

        <div className="manifesto-points">
          <div>
            <b>↗ Practical learning</b>
            <small>Apply what you learn, not theory for its own sake.</small>
          </div>

          <div>
            <b>↗ Real projects</b>
            <small>Create work of your own that you can share.</small>
          </div>

          <div>
            <b>↗ Mentor support</b>
            <small>Helpful questions, honest feedback, clear next steps.</small>
          </div>

          <div>
            <b>↗ A welcoming path</b>
            <small>
              New to the field or building on experience? Start here.
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}
