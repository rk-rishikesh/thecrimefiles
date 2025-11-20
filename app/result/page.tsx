"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { getCaseData } from "../lib/caseData";
import { REAL_KILLER_ID } from "../../constant/constants";

export default function ResultPage() {
  const caseData = useMemo(() => getCaseData(), []);
  const suspects = caseData.suspects.map((suspect, index) => ({
    id: String(index + 1),
    name: suspect.name,
    occupation: suspect.occupation,
    status: suspect.status,
  }));

  // Mock data
  const userChoice = {
    suspectId: "1",
    suspectName: "Lucía Benítez",
    explanation: "She had motive, opportunity, and her fingerprints were found on the balcony. The timing of her stream ending matches the murder window."
  };

  const realKiller = {
    suspectId: REAL_KILLER_ID,
    suspectName: suspects.find(s => s.id === REAL_KILLER_ID)?.name || "Unknown"
  };

  const isWinner = userChoice.suspectId === realKiller.suspectId;

  return (
    <div className="min-h-screen bg-[#070A12] text-[#FFFFFF] font-body relative overflow-hidden">
      {/* Navigation Bar */}
      <nav className="relative z-20 flex items-center justify-between px-6 pt-8 pb-4 md:px-12 md:pt-12 md:pb-6">
        <Link href="/" className="text-white hover:text-gray-400 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <Link href="/result" className="text-xl md:text-2xl font-headline tracking-wide uppercase ml-auto">
          Final Verdict
        </Link>
      </nav>

      {/* Blurred background effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2B2B32] via-[#070A12] to-[#101218] blur-3xl"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-28">
        <div className="max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-headline uppercase tracking-tight mb-4">
              Case Closed
            </h1>
            <p className="text-sm md:text-base text-[#C2C2C2]">
              The truth has been revealed. Here are the final results.
            </p>
          </div>

          {/* Win/Loss Banner */}
          <div className={`mb-12 p-6 md:p-8 rounded-lg border-2 text-center ${
            isWinner 
              ? "bg-green-900/20 border-green-500/50" 
              : "bg-red-900/20 border-red-500/50"
          }`}>
            <h2 className={`text-3xl md:text-4xl font-headline uppercase mb-2 ${
              isWinner ? "text-green-400" : "text-red-400"
            }`}>
              {isWinner ? "YOU WON" : "YOU LOST"}
            </h2>
            <p className="text-sm md:text-base text-[#C2C2C2]">
              {isWinner 
                ? "Congratulations! You correctly identified the killer." 
                : "The real killer has been revealed. Better luck next time."}
            </p>
          </div>

          {/* Comparison Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
            {/* Your Accusation */}
            <div className="border border-white/20 p-6 md:p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-headline uppercase tracking-wide mb-6 text-center">
                Your Accusation
              </h2>
              
              <div className="flex flex-col items-center mb-6">
                {/* Suspect Image */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden relative mb-4">
                  <Image
                    src={`/characters/${userChoice.suspectId}.webp`}
                    alt={userChoice.suspectName}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Suspect Info */}
                <h3 className="text-2xl md:text-3xl font-headline uppercase mb-2 text-center">
                  {userChoice.suspectName}
                </h3>
                <p className="text-sm text-[#C2C2C2] mb-4 text-center">
                  {suspects.find(s => s.id === userChoice.suspectId)?.occupation} - {suspects.find(s => s.id === userChoice.suspectId)?.status}
                </p>
              </div>

              {/* Explanation */}
              <div>
                <span className="text-xs uppercase tracking-wide text-[#C2C2C2] font-headline block mb-2">
                  How It Happened
                </span>
                <p className="text-[#EDEDED] text-sm md:text-base leading-relaxed whitespace-pre-line text-justify">
                  {userChoice.explanation}
                </p>
              </div>
            </div>

            {/* The Real Killer */}
            <div className="border border-white/20 p-6 md:p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-headline uppercase tracking-wide mb-6 text-center">
                The Real Killer
              </h2>
              
              <div className="flex flex-col items-center mb-6">
                {/* Suspect Image */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden relative mb-4">
                  <Image
                    src={`/characters/${realKiller.suspectId}.webp`}
                    alt={realKiller.suspectName}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Suspect Info */}
                <h3 className="text-2xl md:text-3xl font-headline uppercase mb-2 text-center">
                  {realKiller.suspectName}
                </h3>
                <p className="text-sm text-[#C2C2C2] mb-4 text-center">
                  {suspects.find(s => s.id === realKiller.suspectId)?.occupation} - {suspects.find(s => s.id === realKiller.suspectId)?.status}
                </p>
              </div>

              {/* Real Killer Description */}
              <div>
                <span className="text-xs uppercase tracking-wide text-[#C2C2C2] font-headline block mb-2">
                  The Truth
                </span>
                <p className="text-[#EDEDED] text-sm md:text-base leading-relaxed text-justify">
                  After thorough investigation and forensic analysis, the evidence conclusively points to {realKiller.suspectName} as the perpetrator. The case has been officially closed.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

