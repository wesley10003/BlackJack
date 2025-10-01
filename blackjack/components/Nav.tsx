"use client";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import ChipTab from "./ChipTab";
import BuyChipsWindow from "./BuyChipsWindow";
import { useEffect, useState } from "react";


export default function Nav() {
  const [showBuy, setShowBuy] = useState(false);
  const [chips, setChips] = useState<number>(0);

  // auth gate + fetch chips
  useEffect(() => {
    supabase.auth.getSession().then(({data}) => {
      if (!data.session) { 
        window.location.href="/login"; 
        return; 
      }
      supabase.from("profiles").select("chips").single().then(({ data:row })=>{
        setChips(row?.chips ?? 0); 
      });
    });
  }, []);


  const buyChip = async (amount: number) => {
    
    setChips(chips + amount)
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const res = await fetch("/api/buy-chips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });

    const json = await res.json();
    if (!res.ok) {
      console.error(json.error || "Buy failed");
      return;
    }

    // Source of truth from the DB
    setChips(json.chips);
  };




  return (
    <>
        <header className="flex items-center justify-between py-4 md:py-6">
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold">Blackjack</Link>
            <ChipTab amount={chips} onPlus={() => setShowBuy(true)} className="select-none" />
          </nav>
          <nav className="flex items-center gap-4">
            <Link href="/">Home</Link>
            <Link href="/history">History</Link>
            <Button onClick={async () => { await supabase.auth.signOut(); window.location.href="/login"; }}>Logout</Button>
          </nav>
        </header>
        <BuyChipsWindow
          open={showBuy}
          onClose={() => setShowBuy(false)}
          onBuy={buyChip}
        />
    </>
  );
}
