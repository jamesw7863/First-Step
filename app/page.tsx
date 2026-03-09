import Link from "next/link";
import { PreferenceForm } from "@/components/PreferenceForm";

export default function HomePage() {
  return (
    <main>
      <section className="card" style={{ marginBottom: "1rem" }}>
        <h1 style={{ marginTop: 0 }}>InternList</h1>
        <p>
          Internship discovery platform for UCF students across all majors. Get daily email updates with newly posted
          opportunities that match your interests.
        </p>
        <p>
          <small>
            Looking for admin analytics? Open <Link href="/dashboard">/dashboard</Link>.
          </small>
        </p>
      </section>
      <PreferenceForm />
    </main>
  );
}
