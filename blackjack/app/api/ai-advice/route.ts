import { Card } from "@/lib/blackjack";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  const { playerCards, dealerUpCard, playerTotal } = await req.json();
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});

  const prompt =
    `Blackjack helper. Reply with "Hit" or "Stand", and provide a brief reasoning in one sentence max.\n` +
    `Player cards: ${playerCards.map((c:Card)=>c.rank+c.suit).join(" ")} (total ${playerTotal}). ` +
    `Dealer shows: ${dealerUpCard?.rank}${dealerUpCard?.suit}. ` + 
    `Respond ONLY in valid JSON, NO newlines, NO leading characters, strictly follow the format: {"action": "hit|stand", "reason": "<one sentence explanation>}`;

  try {
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      thinkingConfig: {
        thinkingBudget: 0,
        },
      }
    });
    console.log(response.text)
    return NextResponse.json(JSON.parse(response.text!));
  } catch (e) {
    return NextResponse.json(e, { status: 200 });
  }
}
