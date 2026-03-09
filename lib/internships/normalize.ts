import { createHash } from "node:crypto";
import type { InternshipRecord, WorkStyle } from "@/lib/types";

export interface RawInternship {
  title: string;
  company: string;
  location?: string;
  applyUrl: string;
  postedDate?: string;
  description?: string;
  workStyle?: string;
  categories?: string[];
}

function normalizeText(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

function normalizeWorkStyle(style: string | undefined): WorkStyle {
  const value = style?.toLowerCase() ?? "";
  if (value.includes("remote")) return "remote";
  if (value.includes("hybrid")) return "hybrid";
  if (value.includes("on-site") || value.includes("onsite")) return "onsite";
  return "any";
}

export function buildHashKey(sourceId: string, title: string, company: string, location: string, applyUrl: string): string {
  const canonical = [sourceId, normalizeText(title).toLowerCase(), normalizeText(company).toLowerCase(), normalizeText(location).toLowerCase(), applyUrl.trim()].join("|");

  return createHash("sha256").update(canonical).digest("hex");
}

export function normalizeInternship(raw: RawInternship, sourceId: string): InternshipRecord {
  const title = normalizeText(raw.title);
  const company = normalizeText(raw.company);
  const location = normalizeText(raw.location ?? "Unspecified");
  const applyUrl = raw.applyUrl.trim();

  const postedDate = raw.postedDate && !Number.isNaN(Date.parse(raw.postedDate)) ? raw.postedDate : null;

  return {
    source_id: sourceId,
    title,
    company,
    location,
    work_style: normalizeWorkStyle(raw.workStyle),
    posted_date: postedDate,
    apply_url: applyUrl,
    description_snippet: normalizeText((raw.description ?? "").slice(0, 300)),
    category_tags: raw.categories?.map((entry) => normalizeText(entry.toLowerCase())) ?? [],
    hash_key: buildHashKey(sourceId, title, company, location, applyUrl)
  };
}
