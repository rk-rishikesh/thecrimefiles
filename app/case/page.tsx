import Image from "next/image";
import Link from "next/link";
import { getCaseData } from "../lib/caseData";

export default function CasePage() {
  const caseData = getCaseData();

  return (
    <div className="min-h-screen bg-black text-white font-body">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 pt-8 pb-4 md:px-12 md:pt-12 md:pb-6 bg-black">
        {/* Back Button */}
        <Link href="/casestory" className="text-white hover:text-gray-400 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Page Heading */}
        <Link href="/" className="text-xl md:text-2xl font-headline tracking-wide uppercase ml-auto">
          Case File
        </Link>
      </nav>

      {/* Main Content Area - Three Column Layout */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-8 pt-24 md:pt-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column - Featured Article */}
          <div className="md:col-span-9">
            <article>
              <div className="w-full aspect-video md:h-[500px] mb-4 relative overflow-hidden">
                <Image
                  src="/case/poster.webp"
                  alt="Case poster"
                  fill
                  className="object-contain md:object-cover"
                  priority
                />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white font-headline leading-tight">
                {caseData.reportHeading}
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed mb-6 text-justify">
                {caseData.caseReport.split('\n').map((paragraph, index) => {
                  if (!paragraph.trim()) return null;
                  
                  // Convert "only swaps" to a link
                  const processedParagraph = paragraph.trim().split(/(only swaps)/i).map((part, partIndex) => {
                    if (part.toLowerCase() === 'only swaps') {
                      return (
                        <a
                          key={partIndex}
                          href="https://onlyswaps.dcipher.network/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white underline hover:text-gray-400 transition-colors"
                        >
                          {part}
                        </a>
                      );
                    }
                    return part;
                  });
                  
                  return (
                    <p key={index}>{processedParagraph}</p>
                  );
                })}
              </div>
            </article>
            </div>

          {/* Right Column */}
          <aside className="md:col-span-3 space-y-6">
            {/* Victim Details */}
            <div className="p-5 border border-white/20">
              <div className="relative w-full aspect-square mb-4 overflow-hidden">
                <Image
                  src="/characters/victim.webp"
                  alt="Victim portrait"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
              <h3 className="font-bold text-lg mb-3 text-white font-headline uppercase tracking-wide">Victim Profile</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {caseData.victimDetails}
              </p>
            </div>

            {/* Suspects Section */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-white font-headline uppercase tracking-wide">SUSPECTS</h3>
              <div className="space-y-4">
                {caseData.suspects.map((suspect, index) => (
                  <Link key={index} href={`/suspects/${index + 1}`} className="block group">
                    <article className="cursor-pointer hover:opacity-80 transition-opacity">
                      <div className="w-full h-30 mb-2 relative overflow-hidden">
                        <Image
                          src={`/suspects/${index + 1}.webp`}
                          alt={suspect.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm text-white flex-1">
                          {suspect.oneLiner}
                        </h4>
                        <div className="flex-shrink-0 mt-1">
                          <svg className="w-4 h-4 text-white group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Case Details Section Below Main Content */}
        <div className="mt-12 pt-8 border-t-2 border-white flex flex-row flex-wrap justify-between gap-4">
          <div className="flex-1 min-w-[45%]">
            <h3 className="font-bold text-sm uppercase tracking-wide text-gray-400 mb-2 font-headline">Case Number</h3>
            <p className="text-lg font-medium text-white">{caseData.caseNumber}</p>
          </div>
          <div className="flex-1 min-w-[45%] text-right">
            <h3 className="font-bold text-sm uppercase tracking-wide text-gray-400 mb-2 font-headline">FIR Number</h3>
            <p className="text-lg font-medium text-white">{caseData.firNumber}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
