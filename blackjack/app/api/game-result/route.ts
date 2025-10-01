import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { player_total, dealer_total, result, bet, net } = await req.json();

  // Authenticate the request with the user's JWT so RLS applies
  const auth = req.headers.get("authorization"); // "Bearer <token>"
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: auth } } }
  );

  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Update chips atomically-ish (read -> write)
  const { data: prof } = await supabase.from("profiles").select("chips").single();
  const newChips = (prof?.chips ?? 0) + Number(net || 0);
  const { error: upErr } = await supabase.from("profiles").update({ chips: newChips }).eq("id", user.id);
  if (upErr) return NextResponse.json({ error: "Chip update failed" }, { status: 500 });

  // Insert history
  const { error: insErr } = await supabase.from("game_history").insert({
    user_id: user.id,
    player_total, dealer_total, result, bet, net_change: net
  });
  if (insErr) return NextResponse.json({ error: "History insert failed" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
