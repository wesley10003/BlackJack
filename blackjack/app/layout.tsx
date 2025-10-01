import "./globals.css";
import { ReactNode } from "react";

export const metadata = { title: "Blackjack", description: "MAC Projects Blackjack" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh bg-black text-white overflow-x-hidden">
        {/* Centered content container */}
        <div className="mx-auto w-full max-w-[420px] sm:max-w-[520px] md:max-w-[1100px] px-4 sm:px-6 md:px-8">
          {children}
        </div>
      </body>
    </html>
  );
}