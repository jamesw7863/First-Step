import { NextRequest, NextResponse } from "next/server";
import { requireCronSecret } from "@/lib/security";
import { getServiceClient } from "@/lib/supabase/admin";
import { sendDigestBatch } from "@/lib/internships/digest";
import type { InternshipRecord } from "@/lib/types";

export async function POST(request: NextRequest) {
  if (!requireCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const usersResult = await supabase
    .from("users")
    .select("id,email")
    .is("unsubscribed_at", null);

  if (usersResult.error) {
    return NextResponse.json({ error: usersResult.error.message }, { status: 500 });
  }

  const users = usersResult.data ?? [];
  const candidates: { userId: string; email: string; internships: InternshipRecord[] }[] = [];

  for (const user of users) {
    const matchesResult = await supabase
      .from("matches")
      .select(
        "match_score, internships(id,source_id,title,company,location,work_style,posted_date,discovered_at,apply_url,description_snippet,category_tags,hash_key)"
      )
      .eq("user_id", user.id)
      .gte("matched_at", since)
      .order("match_score", { ascending: false })
      .limit(20);

    if (matchesResult.error) {
      console.error(`Failed to load matches for user ${user.id}: ${matchesResult.error.message}`);
      continue;
    }

    const internships = (matchesResult.data ?? [])
      .flatMap((entry) => {
        if (!entry.internships) return [];
        return Array.isArray(entry.internships) ? entry.internships : [entry.internships];
      })
      .filter(Boolean) as InternshipRecord[];

    if (internships.length > 0) {
      candidates.push({
        userId: user.id,
        email: user.email,
        internships
      });
    }
  }

  const delivery = await sendDigestBatch(candidates);

  const digestRows = delivery.map((result) => {
    const candidate = candidates.find((entry) => entry.userId === result.userId);
    const internshipIds =
      candidate?.internships
        .map((item) => item.id)
        .filter((item): item is number => typeof item === "number") ?? [];
    return {
      user_id: result.userId,
      send_date: new Date().toISOString().slice(0, 10),
      internship_ids: internshipIds,
      sent_at: new Date().toISOString(),
      status: result.status,
      provider_message: result.message ?? null
    };
  });

  const insertResult = await supabase.from("digests").insert(digestRows);

  if (insertResult.error) {
    return NextResponse.json({ error: insertResult.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, attempted: candidates.length, delivery });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
