import { NextRequest, NextResponse } from "next/server";
import { requireCronSecret } from "@/lib/security";
import { runIngestion } from "@/lib/internships/ingest";

export async function POST(request: NextRequest) {
  if (!requireCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await runIngestion();
  return NextResponse.json({ ok: true, summary });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
