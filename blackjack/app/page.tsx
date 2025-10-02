"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Hand from "@/components/Hand";
import BettingSection from "@/components/BettingSection";
import ActionBar from "@/components/ActionBar";
import BuyChipsWindow from "@/components/BuyChipsWindow";
import ChipTab from "@/components/ChipTab";
import AISuggestion from "@/components/AISuggestion";
import { makeDeck, shuffle, total, isBlackjack, decide, type Card as BJCard, type Outcome } from "@/lib/blackjack";


export default function Home() {
  const [chips, setChips] = useState<number>(0);
  const [bet, setBet] = useState<number>(100);

  const [deck, setDeck] = useState<BJCard[]>([]);
  const [player, setPlayer] = useState<BJCard[]>([]);
  const [dealer, setDealer] = useState<BJCard[]>([]);
  const [playerDone, setPlayerDone] = useState(true);
  const [result, setResult] = useState<Outcome | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBuy, setShowBuy] = useState(false);
  const [aiAction, setAiAction] = useState<string | null>(null);
  const [aiReason, setAiReason] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false); 
  const [dealing, setDealing] = useState(false); 


  const pTotal = useMemo(()=> total(player), [player]);
  const dTotal = useMemo(()=> total(dealer), [dealer]);

  // auth gate + fetch chips
  useEffect(() => {
    supabase.auth.getSession().then(({data}) => {
      if (!data.session) { 
        window.location.href="/login"; 
        return; 
      }
      supabase.from("profiles").select("chips").single().then(({ data:row })=>{
        setChips(row?.chips ?? 0); 
        setLoading(false);
      });
    });
  }, []);

  const resetGame = () => {
    setPlayerDone(true);
    setPlayer([]);
    setDealer([]);
    setAiAction(null)
    setAiReason(null)
    setResult(null);
  }

  const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

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


  const deal = async () => {
    if (bet < 1 || bet > chips) return;
    try {
      setDealing(true)
      const d = shuffle(makeDeck());
      setDeck(d);
      setPlayer([]); setDealer([]);
      setResult(null); 
      setPlayerDone(false);

      // 1) player first
      const p1 = d.pop()!;
      setPlayer([p1]);
      await wait(200);

      // 2) dealer upcard
      const du = d.pop()!;
      setDealer([du]);
      await wait(200);

      // 3) player second
      const p2 = d.pop()!;
      setPlayer(prev => [...prev, p2]);
      await wait(200);

      const p = [p1, p2];
      const dl = [du];

      const pBJ = isBlackjack(p); 
      const dBJ = isBlackjack(dl);
      if (pBJ || dBJ) {
        setPlayerDone(true);
        if (pBJ && dBJ) { 
          await finish("PUSH", p, dl); 
        }
        else if (pBJ) { 
          await finish("BLACKJACK", p, dl); 
        }
        else { 
          await finish("LOSE", p, dl); 
        }
      }
    } finally {
      setDealing(false)
    }
  };

  const hit = () => {
    if (playerDone || !deck.length || result) return;

    setAiAction(null);
    setAiReason(null);

    const d = [...deck]; 
    const card = d.pop()!;
    const p = [...player, card];
    setDeck(d); 
    setPlayer(p);
    if (total(p) > 21) { setPlayerDone(true); finish("LOSE", p, dealer); }
  };

  const stand = async () => {
    if (playerDone || result) return;

    setAiAction(null);
    setAiReason(null);

    const d = [...deck];
    let dCards = [...dealer];
    while (total(dCards) < 17) {
      const c = d.pop()!;
      dCards = [...dCards, c];
      setDealer(dCards);
      await wait(250);   
    }
    setDeck(d);

    const outcome = decide(total(player), total(dCards));
    await finish(outcome, player, dCards);
  };

  const finish = async (outcome: Outcome, pCards: BJCard[], dCards: BJCard[]) => {
    setPlayerDone(true)
    setResult(outcome);
    const pTot = total(pCards); const dTot = total(dCards);
    const net = outcome==="WIN" ? bet : outcome==="BLACKJACK" ? Math.floor(1.5*bet) : outcome==="LOSE" ? -bet : 0;
    setChips(c => c + net);

    // send to server with user token
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    await fetch("/api/game-result", {
      method: "POST",
      headers: { "Content-Type":"application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({
        player_total: pTot, dealer_total: dTot, result: outcome, bet, net
      })
    }).catch(()=>{});
  };

  const askAI = async () => {
    if (aiLoading) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai-advice", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({
          playerCards: player, dealerUpCard: dealer[0], playerTotal: pTotal
        })
      });
      const { action, reason } = await res.json();
      setAiAction(action)
      setAiReason(reason)
    } finally {
      setAiLoading(false)
    }    
  };

  if (loading) return null;

  return (
    <>
      <header className="flex items-center justify-between flex-nowrap py-3">
        <div className="flex items-center gap-5">
          <Link href="/" className="text-2xl font-extrabold whitespace-nowrap">Blackjack</Link>
          <ChipTab amount={chips} onPlus={() => setShowBuy(true)} className="flex-shrink min-w-0" />
        </div>
        <nav className="flex items-center gap-3 min-w-0 whitespace-nowrap text-sm">
          <Link href="/">Home</Link>
          <Link href="/history">History</Link>
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href="/login"; }}>Logout</button>
        </nav>
      </header>
      <BuyChipsWindow
        open={showBuy}
        onClose={() => setShowBuy(false)}
        onBuy={buyChip}
      />
      <div className="mx-auto w-full max-w-[680px] mt-10">
        <div className="flex flex-col items-center gap-4">
          <Hand cards={dealer} slots={2}/>
          <div className="flex justify-center items-center">
            <span className="inline-flex items-center gap-1 rounded-lg bg-white px-5 py-2 text-sm font-medium text-black mb-5">
              {dTotal}  Dealer
            </span>
          </div>

          <Hand cards={player} slots={2}/>
          {!result ? (
            <div className="flex justify-center items-center">
              <span className="inline-flex items-center gap-1 rounded-lg bg-white px-5 py-2 text-sm font-medium text-black">
                {pTotal ? (`${pTotal} You`) : "You"} 
              </span>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <span className={`inline-flex items-center gap-1 rounded-lg px-5 py-2 text-sm font-medium text-white ${result==="WIN"||result==="BLACKJACK" ? "bg-green-500" :
                  result==="LOSE" ? "bg-red-600" : result =="PUSH" ? "bg-amber-600": ""}`}>
                {pTotal} {result}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center mb-4">
          {!result ? (playerDone ? (<BettingSection
            bet={bet}
            setBet={setBet}
            onPlace={deal}       
            disabled={bet < 1 || bet > chips || !!player.length}
            max={chips}
          />) : (
            <div className="mt-4 flex flex-col items-center">
              <ActionBar
                onHit={hit}
                onStand={stand}
                onHelp={askAI}
                disabled={playerDone || !!result || dealing}
                highlight={aiAction}
                thinking={aiLoading}
              />
              <div className="mt-3">
                <AISuggestion action={aiAction} reason={aiReason}/>
              </div>
            </div>
          )): ""}
          <div className="flex items-center justify-center gap-3 mt-10">
            {result && <Button className="h-11 w-50 rounded-2xl bg-white text-black font-medium transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={()=>{resetGame()}}>New Game</Button>}
          </div>
        </div>
      </div>
    </>
  );
}
