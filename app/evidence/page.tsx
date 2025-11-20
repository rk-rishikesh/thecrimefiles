import Image from "next/image";
import Link from "next/link";
import { getCaseData } from "../lib/caseData";

export default function EvidencePage() {
  const caseData = getCaseData();

  const evidenceItems = caseData.evidences.map((ev, index) => ({
    id: String(index + 1), // Use 1-based index for routing
    displayId: ev.id || `E-${String(index + 1).padStart(2, '0')}`, // Display ID for UI
    title: ev.name,
    type: ev.type,
    description: ev.description,
    status: ev.status
  }));

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
        <Link href="/evidence" className="text-xl md:text-2xl font-headline tracking-wide uppercase ml-auto">
          Evidence Files
        </Link>
      </nav>

      {/* Main Content */}
      <main className="px-6 md:px-12 lg:px-16 py-12 md:py-16 pt-24 md:pt-32">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <p className="text-[#C2C2C2] max-w-2xl">
              All collected evidence, documents, and forensic materials related to the case.
            </p>
          </div>

          {/* Evidence Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {evidenceItems.map((item) => (
              <Link
                key={item.id}
                href={`/evidence/${item.id}`}
                className="p-6 transition-all cursor-pointer group block"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs uppercase tracking-wide text-[#C2C2C2]">{item.displayId}</span>
                  <div className="text-white group-hover:text-gray-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-2 group-hover:text-[#FFFFFF]/80 transition-colors font-headline">
                  {item.title}
                </h3>
                <p className="text-sm uppercase tracking-wide text-[#C2C2C2] mb-3">{item.type}</p>
                <p className="text-[#EDEDED] text-sm leading-relaxed">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

