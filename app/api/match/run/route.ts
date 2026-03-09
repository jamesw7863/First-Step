import { NextRequest, NextResponse } from "next/server";
import { requireCronSecret } from "@/lib/security";
import { getServiceClient } from "@/lib/supabase/admin";
import { buildMatches } from "@/lib/internships/matching";
import type { InternshipRecord, UserProfile } from "@/lib/types";

export async function POST(request: NextRequest) {
  if (!requireCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const internshipsResult = await supabase
    .from("internships")
    .select("id,source_id,title,company,location,work_style,posted_date,discovered_at,apply_url,description_snippet,category_tags,hash_key")
    .gte("discovered_at", since);

  if (internshipsResult.error) {
    return NextResponse.json({ error: internshipsResult.error.message }, { status: 500 });
  }

  const profilesResult = await supabase
    .from("profiles")
    .select("user_id,major,internship_types,keywords,locations,work_style");

  if (profilesResult.error) {
    return NextResponse.json({ error: profilesResult.error.message }, { status: 500 });
  }

  const matches = buildMatches(
    (internshipsResult.data ?? []) as InternshipRecord[],
    (profilesResult.data ?? []) as UserProfile[]
  );

  if (matches.length === 0) {
    return NextResponse.json({ ok: true, created: 0 });
  }

  const insertResult = await supabase.from("matches").upsert(matches, {
    onConflict: "user_id,internship_id"
  });

  if (insertResult.error) {
    return NextResponse.json({ error: insertResult.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, created: matches.length });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
