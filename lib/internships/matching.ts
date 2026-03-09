import type { InternshipRecord, UserProfile, WorkStyle } from "@/lib/types";

interface MatchResult {
  internship_id: number;
  user_id: string;
  match_score: number;
}

function tokenize(input: string): Set<string> {
  return new Set(
    input
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .map((token) => token.trim())
      .filter(Boolean)
  );
}

function includesAny(needles: string[], haystack: string): boolean {
  const lowered = haystack.toLowerCase();
  return needles.some((entry) => lowered.includes(entry.toLowerCase()));
}

function scoreWorkStyle(profileStyle: WorkStyle, internshipStyle: WorkStyle): number {
  if (profileStyle === "any") return 1;
  if (internshipStyle === "any") return 0.5;
  return profileStyle === internshipStyle ? 2 : -2;
}

export function scoreInternshipForProfile(internship: InternshipRecord, profile: UserProfile): number {
  const mergedText = `${internship.title} ${internship.company} ${internship.description_snippet} ${internship.category_tags.join(" ")}`;
  const loweredText = mergedText.toLowerCase();
  const tokens = tokenize(mergedText);

  let score = 0;

  if (loweredText.includes(profile.major.toLowerCase()) || tokens.has(profile.major.toLowerCase())) score += 3;
  if (includesAny(profile.internship_types, internship.title)) score += 3;
  if (includesAny(profile.locations, internship.location)) score += 2;
  if (includesAny(profile.keywords, mergedText)) score += Math.min(profile.keywords.length, 4);
  score += scoreWorkStyle(profile.work_style, internship.work_style);

  return score;
}

export function buildMatches(internships: InternshipRecord[], profiles: UserProfile[], minimumScore = 3): MatchResult[] {
  const matches: MatchResult[] = [];

  for (const internship of internships) {
    if (!internship.id) continue;

    for (const profile of profiles) {
      const score = scoreInternshipForProfile(internship, profile);
      if (score >= minimumScore) {
        matches.push({
          internship_id: internship.id,
          user_id: profile.user_id,
          match_score: score
        });
      }
    }
  }

  return matches;
}
