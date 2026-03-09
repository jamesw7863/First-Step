import { Resend } from "resend";
import type { InternshipRecord } from "@/lib/types";

interface DigestCandidate {
  email: string;
  userId: string;
  internships: InternshipRecord[];
}

function internshipRow(internship: InternshipRecord): string {
  return `<li><a href="${internship.apply_url}">${internship.title}</a> at ${internship.company} (${internship.location})</li>`;
}

function digestTemplate(entries: InternshipRecord[], unsubscribeLink: string): string {
  return `
    <h2>Your Daily FirstStep Digest</h2>
    <p>New internship opportunities from the last 24 hours:</p>
    <ul>
      ${entries.map((entry) => internshipRow(entry)).join("\n")}
    </ul>
    <p><small>Manage preferences or unsubscribe: <a href="${unsubscribeLink}">${unsubscribeLink}</a></small></p>
  `;
}

export async function sendDigestBatch(candidates: DigestCandidate[]) {
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!resendKey || !from) {
    throw new Error("Missing email provider credentials.");
  }

  const resend = new Resend(resendKey);

  const results: { userId: string; status: "sent" | "failed"; message?: string }[] = [];

  for (const candidate of candidates) {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (!appUrl) {
        throw new Error("Missing NEXT_PUBLIC_APP_URL.");
      }
      const unsubscribeLink = `${appUrl}/api/unsubscribe?userId=${candidate.userId}`;
      await resend.emails.send({
        from,
        to: candidate.email,
        subject: `FirstStep: ${candidate.internships.length} new internship matches`,
        html: digestTemplate(candidate.internships, unsubscribeLink)
      });
      results.push({ userId: candidate.userId, status: "sent" });
    } catch (error) {
      results.push({ userId: candidate.userId, status: "failed", message: String(error) });
    }
  }

  return results;
}
