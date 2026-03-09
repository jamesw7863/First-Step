import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const result = await supabase
    .from("users")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("id", userId);

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  return new NextResponse("You have been unsubscribed from daily InternList emails.", {
    headers: { "Content-Type": "text/plain" }
  });
}
