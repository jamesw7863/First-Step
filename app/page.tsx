import Link from "next/link";
import Image from "next/image";
import { PreferenceForm } from "@/components/PreferenceForm";

export default function HomePage() {
  return (
    <main className="landing-shell">
      <div className="landing-frame">
        <header className="top-nav">
          <div className="brand">
            <span className="brand-logo-wrap">
              <Image className="brand-logo" src="/pegasus-logo.webp" alt="UCF Pegasus logo" width={46} height={46} />
            </span>
            <span>FIRSTSTEP</span>
          </div>
          <nav>
            <a href="#how-it-works">How it works</a>
            <a href="#employers">For Employers</a>
            <a href="#about">About</a>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
        </header>

        <section className="hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-content">
            <h1>
              FirstStep to Internships.
              <span>All Majors.</span>
            </h1>
            <p>
              Tell us your major and interests. We&apos;ll find new internship opportunities and send them daily.
            </p>
            <PreferenceForm />
          </div>
        </section>
      </div>
    </main>
  );
}
