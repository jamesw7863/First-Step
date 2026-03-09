import { describe, expect, it } from "vitest";
import { buildMatches, scoreInternshipForProfile } from "@/lib/internships/matching";
import type { InternshipRecord, UserProfile } from "@/lib/types";

const internship: InternshipRecord = {
  id: 12,
  source_id: "src",
  title: "Data Science Intern",
  company: "Acme",
  location: "Remote - US",
  work_style: "remote",
  posted_date: null,
  apply_url: "https://acme.com/job/12",
  description_snippet: "Python statistics experimentation",
  category_tags: ["data", "analytics"],
  hash_key: "abc"
};

const profile: UserProfile = {
  user_id: "u1",
  major: "Data Science",
  internship_types: ["data science", "analytics"],
  keywords: ["python", "statistics"],
  locations: ["remote"],
  work_style: "remote"
};

describe("matching", () => {
  it("scores relevant internships above minimum threshold", () => {
    const score = scoreInternshipForProfile(internship, profile);
    expect(score).toBeGreaterThanOrEqual(6);
  });

  it("builds match rows for qualifying internships", () => {
    const matches = buildMatches([internship], [profile], 3);
    expect(matches).toHaveLength(1);
    expect(matches[0].internship_id).toBe(12);
    expect(matches[0].user_id).toBe("u1");
  });
});
