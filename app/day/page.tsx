import Link from "next/link";
import { getCaseData } from "../lib/caseData";

export default function DayPage() {
  const caseData = getCaseData();
  const timeline = caseData.timeline ?? [];

  return (
    <div className="min-h-screen bg-[#070A12] text-[#FFFFFF] font-body">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 pt-8 pb-4 md:px-12 md:pt-12 md:pb-6 bg-[#070A12]">
        {/* Back Button */}
        <Link href="/casestory" className="text-white hover:text-gray-400 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Page Heading */}
        <Link href="/day" className="text-xl md:text-2xl font-headline tracking-wide uppercase ml-auto">
          Case Timeline
        </Link>
      </nav>

      {/* Main Content */}
      <main className="px-6 md:px-12 lg:px-16 py-12 md:py-16 pt-24 md:pt-32">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <p className="text-[#C2C2C2] max-w-2xl">
              Follow the critical moments of the investigation. Each entry marks a key event, piecing together what happened that night.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative pl-6 md:pl-10 before:absolute before:left-1 before:top-0 before:bottom-0 before:w-px before:bg-white/20">
            <ul className="space-y-8">
              {timeline.map((entry, index) => (
                <li key={`${entry.time}-${index}`} className="relative group">
                  <div className="absolute -left-[23px] md:-left-[31px] mt-1 w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-white"></div>
                  <div className="p-6 transition-all cursor-pointer block">
                    <div className="mb-3">
                      <span className="text-xs uppercase tracking-wide text-[#C2C2C2]">
                        {entry.time}
                      </span>
                    </div>
                    <h3 className="text-xl font-medium mb-2 group-hover:text-[#FFFFFF]/80 transition-colors font-headline">
                      {entry.event}
                    </h3>
                    {entry.notes && (
                      <p className="text-[#EDEDED] text-sm leading-relaxed">
                        {entry.notes}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}