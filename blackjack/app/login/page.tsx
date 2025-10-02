"use client";

import { useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
export default function LoginOtp() {
  const [step, setStep] = useState<"email"|"code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [info, setInfo] = useState<string|null>(null);

  const sendCode = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); setInfo(null);
    if (!email) return setError("Please enter your email.");
    setSending(true);
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true }
    });
    setSending(false);
    if (error) {
      setError(error.message);
    } else {
      setInfo("Verification code sent! Check your email.");
      setStep("code");
    }
  };

  const verifyCode = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); setInfo(null);
    if (!code) return setError("Enter the 6-digit code from your email.");
    setVerifying(true);
    // Verify a code sent via Email OTP
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email", 
    });
    setVerifying(false);
    if (error) {
      setError(error.message);
      return;
    }
    // Success → go to app
    if (data?.user) {
      window.location.href = "/";
    } else {
      setError("Could not verify code. Try again.");
    }
  };


   return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-center text-3xl font-extrabold tracking-wide">Blackjack</h1>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,.04),0_20px_50px_rgba(0,0,0,.5)]">
          {step === "email" ? (
            <form onSubmit={sendCode} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-extrabold tracking-wide">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-white/15 bg-black/40 px-3
                             outline-none ring-0 focus:border-white/30"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={sending}
                className="h-11 w-full rounded-xl bg-white text-black font-medium
                           transition hover:opacity-90 disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm">Enter Code</label>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  required
                  className="h-11 w-full tracking-[0.4em] text-center text-lg rounded-xl
                             border border-white/15 bg-black/40 px-3
                             outline-none ring-0 focus:border-white/30"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={verifying}
                className="h-11 w-full rounded-xl bg-white text-black font-medium
                           transition hover:opacity-90 disabled:opacity-60"
              >
                {verifying ? "Verifying..." : "Verify & Continue"}
              </button>

              <button
                type="button"
                onClick={() => setStep("email")}
                className="block w-full text-center text-sm text-white/70 hover:text-white transition"
              >
                Change email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}