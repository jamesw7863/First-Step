import { NextResponse } from "next/server";
import { z } from "zod";
import { getServiceClient } from "@/lib/supabase/admin";

const preferenceSchema = z.object({
  email: z.string().email(),
  school: z.string().min(2).max(100),
  major: z.string().min(2).max(100),
  graduationYear: z.number().int().min(2024).max(2035),
  internshipTypes: z.array(z.string().min(1)).min(1),
  keywords: z.array(z.string().min(1)).max(20),
  locations: z.array(z.string().min(1)).max(20),
  workStyle: z.enum(["remote", "hybrid", "onsite", "any"])
});

export async function POST(request: Request) {
  const parsed = preferenceSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  const supabase = getServiceClient();

  const userUpsert = await supabase
    .from("users")
    .upsert(
      {
        email: payload.email.toLowerCase().trim(),
        school: payload.school
      },
      {
        onConflict: "email"
      }
    )
    .select("id")
    .single();

  if (userUpsert.error || !userUpsert.data) {
    return NextResponse.json({ error: userUpsert.error?.message ?? "Unable to create user." }, { status: 500 });
  }

  const profileUpsert = await supabase.from("profiles").upsert(
    {
      user_id: userUpsert.data.id,
      major: payload.major,
      graduation_year: payload.graduationYear,
      internship_types: payload.internshipTypes,
      keywords: payload.keywords,
      locations: payload.locations,
      work_style: payload.workStyle,
      updated_at: new Date().toISOString()
    },
    {
      onConflict: "user_id"
    }
  );

  if (profileUpsert.error) {
    return NextResponse.json({ error: profileUpsert.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, userId: userUpsert.data.id });
}
