"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use } from "react";
import { getSuspectById } from "../../lib/caseData";

interface SuspectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SuspectDetailPage({ params }: SuspectDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const suspectId = parseInt(id);
  const suspectData = getSuspectById(suspectId);

  const suspect = suspectData ? {
    name: suspectData.name,
    age: suspectData.age,
    occupation: suspectData.occupation,
    status: suspectData.status,
    description: suspectData.description,
    alibi: suspectData.alibi,
    timeline: suspectData.timeline,
    notes: suspectData.notes
  } : {
    name: "Unknown Suspect",
    age: 0,
    occupation: "Unknown",
    status: "Unknown",
    description: "No information available",
    alibi: "Not provided",
    timeline: [],
    notes: []
  };

  const timelineEntries = suspect.timeline ?? [];
  const parsedTimeline = timelineEntries.map((entry) => {
    const [time, ...details] = entry.split(" - ");
    return {
      time: time?.trim() ?? "",
      event: details.join(" - ").trim() || entry,
    };
  });

  return (
    <div className="min-h-screen md:h-screen bg-black text-white font-body flex flex-col">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 pt-8 pb-4 md:px-12 md:pt-12 md:pb-6 bg-black">
        {/* Back Button */}
        <Link href="/suspects" className="text-white hover:text-gray-400 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Page Heading */}
        <Link href="/" className="text-xl md:text-2xl font-headline tracking-wide uppercase ml-auto">
          {suspect.name}
        </Link>
      </nav>

      {/* Main Content Area - Black Background */}
      <main className="flex-1 bg-black relative flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-8 px-0 md:px-6 lg:px-12 pt-24 md:pt-32 pb-8 min-h-0 max-w-7xl md:mx-auto w-full overflow-y-auto md:overflow-visible">
        {/* Desktop: Chat UI on left, Portrait on right */}
        <div className="hidden md:flex md:flex-1 md:max-w-md rounded-lg overflow-hidden flex-col h-full md:h-[600px] lg:h-[700px]">
          {/* Chat Preview - Link to chat page */}
          <Link href={`/suspects/${id}/chat`} className="flex-1 flex flex-col cursor-pointer">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-0">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-400">JW</span>
                </div>
                <div className="ml-2 md:ml-3">
                  <p className="text-xs md:text-sm font-medium text-white font-body">Det. James Wilson</p>
                  <p className="text-xs text-gray-400 font-body">March 15th, 2024</p>
                </div>
              </div>
            </div>

            {/* Chat History Preview */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
              {/* Bot Message */}
              <div className="flex items-start gap-2 md:gap-3">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-gray-400">JW</span>
                </div>
                <div className="p-2 md:p-3 rounded-lg max-w-[80%]">
                  <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-body">
                    Hello, how can I help you today?
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Right Side - Portrait and Name */}
        <div className="flex flex-col items-center md:justify-between flex-shrink-0 w-full min-h-full md:w-auto md:h-full md:ml-auto py-8 md:py-12">
          {/* Content Section - Takes available space */}
          <div className="flex flex-col items-center md:justify-center flex-1 w-full px-6 md:px-4">
            {/* Suspect Portrait */}
            <div className="w-full max-w-xs h-72 sm:h-96 md:w-56 md:h-72 lg:w-64 lg:h-80 xl:w-72 xl:h-[420px] mb-4 md:mb-8 relative overflow-hidden">
              <Image
                src={`/characters/${id}.webp`}
                alt={suspect.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Suspect Name */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wide text-white font-headline text-center mb-1 md:mb-2">
              {suspect.name}
            </h1>
            
            {/* Age and Occupation */}
            <p className="text-base sm:text-lg md:text-xl text-gray-400 text-center font-body mb-4">
              Age {suspect.age} Year Old {suspect.occupation}
            </p>

            {/* Description - Only visible on mobile */}
            <div className="md:hidden w-full pt-6 pb-2 px-2">
              <p className="text-sm text-gray-300 text-justify font-body leading-relaxed">
                {suspect.description}
              </p>
            </div>

            {parsedTimeline.length > 0 && (
              <div className="w-full mt-6 md:mt-8">
                <div className="relative pl-6 md:pl-8 before:absolute before:left-2 before:top-0 before:bottom-0 before:w-px before:bg-white/20">
                  <ul className="space-y-5">
                    {parsedTimeline.map((entry, index) => (
                      <li key={`${entry.time}-${index}`} className="relative">
                        <div className="pb-1">
                          {entry.time && (
                            <span className="text-xs uppercase tracking-wide text-gray-500 block text-left">
                              {entry.time}
                            </span>
                          )}
                          <p className="text-sm text-gray-200 leading-relaxed mt-1 text-left">
                            {entry.event}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Interrogate Button - Mobile */}
            <div className="md:hidden w-full mt-8 px-6 pb-0">
              <button
                onClick={() => router.push(`/suspects/${id}/chat`)}
                className="btn-interrogate uppercase tracking-wide w-full"
              >
                <span>INTERROGATE</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

