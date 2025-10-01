import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { amount } = await req.json();

  // Basic validation
  const delta = Number(amount);
  if (!Number.isFinite(delta) || delta <= 0 || delta > 1_000_000) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  // Require the user's JWT so RLS applies
  const auth = req.headers.get("authorization"); // "Bearer <token>"
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Create a user-scoped Supabase client (uses anon key + user's JWT)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: auth } } }
  );

  // Optional: verify user exists early
  const { data: { user }, error: uerr } = await supabase.auth.getUser();
  if (uerr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Atomic increment and return the new chips value
  const { data, error } = await supabase.rpc("add_chips", { x: delta }).single();
  if (error) {
    console.error("add_chips error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, chips: data.chips });
}
