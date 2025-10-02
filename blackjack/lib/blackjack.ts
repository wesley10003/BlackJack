export type Card = { rank: string; suit: string };
export type Outcome = "WIN" | "LOSE" | "PUSH" | "BLACKJACK";

const RANKS = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
const SUITS = ["♠","♥","♦","♣"];

export function makeDeck(): Card[] {
  const d: Card[] = [];
  for (const s of SUITS) for (const r of RANKS) d.push({ rank: r, suit: s });
  return d;
}
export function shuffle<T>(a: T[]): T[] {
  for (let i=a.length-1; i > 0; i--) { 
    const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] 
  }
  return a;
}
function value(rank: string): number {
  if (rank === "A") return 1;
  if (["K","Q","J"].includes(rank)) return 10;
  return parseInt(rank,10);
}
export function total(cards: Card[]): number {
  let sum = 0
  let aces = 0;
  for (const c of cards) { 
    if (c.rank==="A") {
      aces++; sum+=1;
    } else {
      sum += value(c.rank);
     } 
  }
  if (aces>0 && sum+10<=21) {
    sum += 10;
  }
  return sum;
}
export function isBlackjack(cards: Card[]) {
  return cards.length===2 && total(cards)===21;
}
export function dealerPlay(start: Card[], deck: Card[]): {cards: Card[]; total: number} {
  const cards = [...start];
  while (total(cards) < 17) {
    cards.push(deck.pop()!)
  }
  return { cards, total: total(cards) };
}
export function decide(player: number, dealer: number): Outcome {
  if (player>21) return "LOSE";
  if (dealer>21) return "WIN";
  if (player>dealer) return "WIN";
  if (player<dealer) return "LOSE";
  return "PUSH";
}
