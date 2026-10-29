export default function Contact() {
  return (
    <section className="call" id="contact">
      <div className="shell call-grid reveal">
        <div>
          <span className="eyebrow">What will you make next?</span>
          <h2>
            Your next move
            <br />
            starts here.
          </h2>
          <p>
            Got a question? Email{" "}
            <a
              href="mailto:support@nextwavebuild.com"
              style={{ textDecoration: "underline" }}
            >
              support@nextwavebuild.com
            </a>
          </p>
        </div>
        <a className="cta" href="https://portal.nextwavebuild.com/register">
          Register now <span>↗</span>
        </a>
      </div>
    </section>
  );
}
