import { describe, expect, it } from "vitest";
import { buildHashKey, normalizeInternship } from "@/lib/internships/normalize";

describe("normalizeInternship", () => {
  it("normalizes fields and produces stable hash", () => {
    const normalized = normalizeInternship(
      {
        title: "  Software Engineer Intern  ",
        company: "  Acme Corp  ",
        location: " Remote ",
        applyUrl: "https://acme.com/intern",
        description: "Great role",
        workStyle: "Remote"
      },
      "source-a"
    );

    expect(normalized.title).toBe("Software Engineer Intern");
    expect(normalized.company).toBe("Acme Corp");
    expect(normalized.work_style).toBe("remote");
    expect(normalized.hash_key).toBe(
      buildHashKey("source-a", "Software Engineer Intern", "Acme Corp", "Remote", "https://acme.com/intern")
    );
  });
});
