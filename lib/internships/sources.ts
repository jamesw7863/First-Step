import type { RawInternship } from "@/lib/internships/normalize";

export interface SourceDefinition {
  id: string;
  name: string;
  type: string;
  url: string;
  titleField: string;
  companyField: string;
  locationField: string;
  applyField: string;
  postedDateField: string;
  descriptionField: string;
  categoriesField: string;
  workStyleField: string;
  active: boolean;
}

export async function fetchSourceInternships(source: SourceDefinition): Promise<RawInternship[]> {
  if (!source.active) return [];

  const response = await fetch(source.url, {
    headers: {
      Accept: "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Source ${source.id} failed with status ${response.status}`);
  }

  const payload = (await response.json()) as Record<string, unknown>[];

  return payload.map((entry) => ({
    title: String(entry[source.titleField] ?? ""),
    company: String(entry[source.companyField] ?? ""),
    location: String(entry[source.locationField] ?? ""),
    applyUrl: String(entry[source.applyField] ?? ""),
    postedDate: String(entry[source.postedDateField] ?? ""),
    description: String(entry[source.descriptionField] ?? ""),
    workStyle: String(entry[source.workStyleField] ?? ""),
    categories: String(entry[source.categoriesField] ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  }));
}
