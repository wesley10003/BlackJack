"use client";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { supabase } from "@/lib/supabaseClient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Row = {
  id: string;
  player_total: number;
  dealer_total: number;
  result: "WIN"|"LOSE"|"PUSH"|"BLACKJACK";
  bet: number;
  net_change: number;
  played_at: string;
};

export default function History() {
  const [rows, setRows] = useState<Row[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    supabase.auth.getSession().then(({data})=>{
      if (!data.session) { window.location.href="/login"; return; }
      supabase.from("game_history")
        .select("*")
        .order("played_at",{ascending:false})
        .range((page-1)*10, page*10-1)
        .then(({data})=> setRows(data ?? []));
    });
  }, [page]);

  return (
    <>
      <Nav/>
      <h1 className="text-2xl font-semibold mb-4">Game History</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Player</TableHead>
            <TableHead>Dealer</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Bet</TableHead>
            <TableHead>Net</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(r=>(
            <TableRow key={r.id}>
              <TableCell>{new Date(r.played_at).toLocaleString()}</TableCell>
              <TableCell>{r.player_total}</TableCell>
              <TableCell>{r.dealer_total}</TableCell>
              <TableCell className={
                r.result==="WIN"||r.result==="BLACKJACK" ? "text-green-400" :
                r.result==="LOSE" ? "text-red-400" : 
                r.result==="PUSH" ? "text-orange-400" : ""
              }>{r.result}</TableCell>
              <TableCell>{r.bet}</TableCell>
              <TableCell className={r.net_change > 0?"text-green-400": r.net_change < 0 ?"text-red-400" : "text-orange-400"}>
                {r.net_change >=0 ? "+" : ""}{r.net_change}
              </TableCell>
            </TableRow>
          ))}
          {rows.length===0 && (
            <TableRow><TableCell colSpan={6} className="text-center">No records</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between mt-4">
        <Button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>Prev</Button>
        <div>Page {page}</div>
        <Button onClick={()=>setPage(p=>p+1)} disabled={rows.length<10}>Next</Button>
      </div>
    </>
  );
}
