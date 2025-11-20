"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { getCaseData } from "../lib/caseData";
import { RESULTS_REVEAL_DATE, getRevealDateFormatted } from "../../constant/constants";
import { contractAddress, contractABI } from "../../constant/contract";

export default function VerdictPage() {
  const caseData = useMemo(() => getCaseData(), []);
  const suspects = caseData.suspects.map((suspect, index) => ({
    id: String(index + 1),
    name: suspect.name,
    oneLiner: suspect.oneLiner,
    occupation: suspect.occupation,
    status: suspect.status,
  }));

  const [selectedSuspectId, setSelectedSuspectId] = useState<string>("1");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { address } = useAccount();

  // Check if player has already submitted a verdict
  const { data: playerVerdict } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: 'getPlayerVerdict',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Set submitted to true if player has already submitted a verdict
  useEffect(() => {
    if (playerVerdict && typeof playerVerdict === 'string' && playerVerdict.trim() !== '') {
      setSubmitted(true);
      // Map the verdict string back to suspect ID
      const suspectNameToId: { [key: string]: string } = {
        "Lucia Benitezsc": "1",
        "Martin Tano Lopez": "2",
        "Dr. Julian Erez": "3",
        "Santiago El Chino Torres": "4"
      };
      const mappedId = suspectNameToId[playerVerdict];
      if (mappedId) {
        setSelectedSuspectId(mappedId);
      }
    }
  }, [playerVerdict]);

  const selectedSuspect = selectedSuspectId
    ? suspects.find((suspect) => suspect.id === selectedSuspectId)
    : null;

  const canSubmitVerdict = selectedSuspectId !== "";

  // Map suspect ID to suspect name for contract
  const getSuspectNameForContract = (suspectId: string): string => {
    const suspectNames: { [key: string]: string } = {
      "1": "Lucia Benitezsc",
      "2": "Martin Tano Lopez",
      "3": "Dr. Julian Erez",
      "4": "Santiago El Chino Torres"
    };
    return suspectNames[suspectId] || suspectNames["1"];
  };

  const handleFinalSubmit = async () => {
    if (!address || !selectedSuspectId) return;

    setIsLoading(true);
    try {
      const suspectID = getSuspectNameForContract(selectedSuspectId);
      console.log(suspectID);
      console.log(address);
      console.log(selectedSuspectId);
      const response = await fetch('/api/record-verdict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userAddress: address,
          suspectID: suspectID
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to record verdict' }));
        throw new Error(errorData.error || 'Failed to record verdict');
      }

      const data = await response.json();

      // Set submitted to true after successful transaction
      setSubmitted(true);
    } catch (error) {
      console.error("Error recording verdict:", error);
      // Still show submitted screen even if there's an error (for now)
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for judgement screen
  const mockVerdict = {
    selectedSuspectId: selectedSuspectId || "1",
    suspectName: selectedSuspect?.name || suspects[0]?.name || "",
  };

  // Countdown timer to November 24, 2025
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const revealDate = RESULTS_REVEAL_DATE.getTime();
      const now = new Date().getTime();
      const difference = revealDate - now;

      if (difference > 0) {
        setTimeRemaining({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, []);

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#070A12] text-[#FFFFFF] font-body relative overflow-hidden">
        {/* Navigation Bar */}
        <nav className="relative z-20 flex items-center justify-between px-6 pt-8 pb-4 md:px-12 md:pt-12 md:pb-6">
          <Link href="/" className="text-white hover:text-gray-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <Link href="/verdict" className="text-xl md:text-2xl font-headline tracking-wide uppercase ml-auto">
            Judgement
          </Link>
        </nav>

        {/* Blurred background effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2B2B32] via-[#070A12] to-[#101218] blur-3xl"></div>
        </div>

        {/* Main Content */}
        <main className="relative z-10 px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-28">
          <div className="max-w-5xl mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-headline uppercase tracking-tight mb-4">
                You Accused
              </h1>
            </div>

            {/* Suspect Photo and Name */}
            <div className="mb-12">
              <div className="flex flex-col items-center gap-6">
                {/* Suspect Image */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden relative flex-shrink-0">
                  <Image
                    src={`/characters/${mockVerdict.selectedSuspectId}.webp`}
                    alt={mockVerdict.suspectName}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Suspect Name */}
                <div className="text-center">
                  <h3 className="text-3xl md:text-4xl font-headline uppercase mb-2">
                    {mockVerdict.suspectName}
                  </h3>
                </div>
              </div>
            </div>


            {/* Block Number Message */}
            <div className="text-center mb-8">
              <p className="text-xs md:text-sm text-[#8F8F8F]">
                The killer would be decrypted on Judgement Day
              </p>
            </div>

            {/* Encryption Message with Image */}
            <div className="text-center mb-12">
              <p className="text-sm md:text-base text-[#C2C2C2] mb-4">
                The killer's name is encrypted.
              </p>
            </div>

          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A12] text-[#FFFFFF] font-body relative overflow-hidden">
      {/* Navigation Bar */}
      <nav className="relative z-20 flex items-center justify-between px-6 pt-8 pb-4 md:px-12 md:pt-12 md:pb-6">
        <Link href="/casestory" className="text-white hover:text-gray-400 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <Link href="/verdict" className="text-xl md:text-2xl font-headline tracking-wide uppercase ml-auto">
          Verdict
        </Link>
      </nav>

      {/* Blurred background effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2B2B32] via-[#070A12] to-[#101218] blur-3xl"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-28">
        <div className="max-w-5xl mx-auto w-full">
          {/* Select Suspect */}
          <div className="relative min-h-screen">
              {/* Large Suspect Image Section - Fades into background */}
              {selectedSuspectId && (
                <div className="absolute top-0 left-0 right-0 h-[60vh] overflow-hidden opacity-30">
                  <div className="relative w-full h-full">
                    <Image
                      src={`/characters/${selectedSuspectId}.webp`}
                      alt={suspects.find(s => s.id === selectedSuspectId)?.name || "Suspect"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#070A12]" />
                  </div>
                </div>
              )}

              {/* Content Container */}
              <div className="relative z-10 pt-8 md:pt-12">
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-headline uppercase tracking-tight mb-2">
                    Accuse Suspect
                  </h1>
                  <p className="text-sm text-[#C2C2C2]">
                    Select the suspect you believe is guilty
                  </p>
                </div>

                {/* Horizontal Suspect Selector */}
                <div className="mb-8">
                  <p className="text-center text-sm text-[#C2C2C2] mb-6 font-headline uppercase tracking-wide">
                    Suspects
                  </p>
                  <div className="overflow-x-auto pb-4 -mx-6 md:-mx-12 lg:-mx-16 px-6 md:px-12 lg:px-16">
                    <div className="flex gap-3 md:gap-4 min-w-max justify-center">
                      {suspects.map((suspect) => {
                        const isActive = suspect.id === selectedSuspectId;
                        return (
                          <button
                            key={suspect.id}
                            type="button"
                            onClick={() => setSelectedSuspectId(suspect.id)}
                            className={`flex-shrink-0 w-16 h-16 md:w-20 mt-4 md:h-20 rounded-full border-2 transition-all relative overflow-visible ${
                              isActive
                                ? "border-white bg-white/20 scale-110"
                                : "border-white/30 hover:border-white/50"
                            }`}
                          >
                            <div className="absolute inset-0 rounded-full overflow-hidden">
                              <Image
                                src={`/characters/${suspect.id}.webp`}
                                alt={suspect.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Suspect Details Cards */}
                {selectedSuspectId && (() => {
                  const selected = suspects.find(s => s.id === selectedSuspectId);
                  return selected ? (
                    <div className="space-y-4 px-6 md:px-0 mb-8">
                      <div className="rounded-lg p-4 md:p-6">
                        <div className="flex justify-center">
                          <p className="text-3xl md:text-4xl font-headline uppercase text-center">{selected.name}</p>
                        </div>
                      </div>
                       
                    </div>
                  ) : null;
                })()}

                {/* Submit Button - Fixed Bottom */}
                <div className="fixed bottom-6 left-6 right-6 md:left-8 md:right-8 md:bottom-8 z-30">
                  <button
                    onClick={handleFinalSubmit}
                    disabled={!canSubmitVerdict || isLoading || !address}
                    className="btn-interrogate uppercase tracking-wide w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isLoading ? "Submitting..." : "Submit Verdict"}</span>
                  </button>
                </div>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}
