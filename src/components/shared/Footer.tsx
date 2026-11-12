import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footgrid">
          <div>
            <a href="#home" className="brand" aria-label="NextWave Build home">
              <Image
                priority
                src="/NextWaveBuild_Horizontal_OnDark_1200px.png"
                alt=""
                width={144}
                height={144}
              />
            </a>

            <p>
              Don&apos;t just learn it, build it. Practical skills, real
              projects and mentor support.
            </p>
          </div>

          <div>
            <h4>Explore</h4>
            <a href="#flagships">Programs</a>

            <a href="#contact">Contact</a>
          </div>

          <div>
            <h4>Next steps</h4>
            <a href="https://portal.nextwavebuild.com/register">Register</a>
            <a href="https://portal.nextwavebuild.com/">Sign in</a>
            <a href="mailto:support@nextwavebuild.com">Support</a>
          </div>

          <div>
            <h4>Information</h4>

            <a href="https://nextwavebuild.com/documents/privacy-policy.pdf">
              Privacy policy
            </a>
            <a href="https://nextwavebuild.com/documents/terms-of-use.pdf">
              Terms of use
            </a>
          </div>
        </div>

        <div className="end">
          <span>© 2026 NextWave Build. All rights reserved.</span>
          <span>Learn. Practise. Build.</span>
        </div>
      </div>
    </footer>
  );
}
