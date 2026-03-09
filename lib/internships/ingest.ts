import sources from "@/data/sources.json";
import type { InternshipRecord } from "@/lib/types";
import { normalizeInternship } from "@/lib/internships/normalize";
import { fetchSourceInternships } from "@/lib/internships/sources";
import { getServiceClient } from "@/lib/supabase/admin";

interface IngestSummary {
  discovered: number;
  upserted: number;
  failedSources: string[];
}

export async function runIngestion(): Promise<IngestSummary> {
  const supabase = getServiceClient();
  const collected: InternshipRecord[] = [];
  const failedSources: string[] = [];

  for (const source of sources) {
    try {
      const rawItems = await fetchSourceInternships(source);
      for (const rawItem of rawItems) {
        if (!rawItem.title || !rawItem.company || !rawItem.applyUrl) continue;
        collected.push(normalizeInternship(rawItem, source.id));
      }
    } catch (error) {
      console.error(`Failed source ${source.id}`, error);
      failedSources.push(source.id);
    }
  }

  if (collected.length === 0) {
    return { discovered: 0, upserted: 0, failedSources };
  }

  const { data, error } = await supabase
    .from("internships")
    .upsert(
      collected.map((internship) => ({
        ...internship,
        discovered_at: new Date().toISOString()
      })),
      {
        onConflict: "hash_key",
        ignoreDuplicates: false
      }
    )
    .select("id");

  if (error) {
    throw new Error(`Ingestion upsert failed: ${error.message}`);
  }

  return {
    discovered: collected.length,
    upserted: data?.length ?? 0,
    failedSources
  };
}
