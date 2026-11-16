import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footgrid">
          {/* Brand Section */}
          <div>
            <a href="#home" className="brand" aria-label="NextWave Build home">
              <Image
                priority
                src="/NextWaveBuild_Horizontal_OnDark_1200px.png"
                alt="NextWave Build"
                width={144}
                height={144}
              />
            </a>

            <p>
              Don&apos;t just learn it, build it. Practical skills, real
              projects and mentor support.
            </p>
          </div>

          {/* Explore Section */}
          <div>
            <h4>Explore</h4>

            <a href="#flagships">Programs</a>

            <a href="#contact">Contact</a>
          </div>

          {/* Next Steps Section */}
          <div>
            <h4>Next steps</h4>

            <a href="https://portal.nextwavebuild.com/register">Register</a>

            <a href="https://portal.nextwavebuild.com/">Sign in</a>

            <a href="mailto:support@nextwavebuild.com">Support</a>
          </div>

          {/* Legal Documents Section */}
          <div>
            <h4>Information</h4>

            <a
              href="/documents/privacy-policy.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>

            <a
              href="/documents/terms-and-conditions.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms &amp; Conditions
            </a>

            <a
              href="/documents/refund-and-cancellation-policy.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Refund &amp; Cancellation Policy
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="end">
          <span>© 2026 NextWave Build. All rights reserved.</span>

          <span>Learn. Practise. Build.</span>
        </div>
      </div>
    </footer>
  );
}
