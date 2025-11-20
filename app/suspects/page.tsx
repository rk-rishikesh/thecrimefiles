import Link from "next/link";
import Image from "next/image";
import { getCaseData } from "../lib/caseData";

export default function SuspectsPage() {
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
                    Suspects
                </Link>
            </nav>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-6 md:px-12 py-8 pt-24 md:pt-32">
                {/* Suspects Section */}
                <div>
                    <div className="mb-12">
                        <p className="text-[#C2C2C2] max-w-2xl">
                            All suspects related to the case investigation. You can interrogate them to gather more information.
                        </p>
                    </div>

                    <div className="space-y-6 md:space-y-8">
                        {caseData.suspects.map((suspect, index) => (
                            <Link
                                key={index}
                                href={`/suspects/${index + 1}`}
                                className="block group"
                            >
                                <article className="py-4 border-b border-white/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs uppercase tracking-wide text-[#C2C2C2]">
                                            {suspect.name}
                                        </span>
                                        <svg
                                            className="w-4 h-4 text-white opacity-70 group-hover:text-gray-300 transition-colors"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                    <div className="w-full h-24 mb-2 relative overflow-hidden">
                                        <Image
                                            src={`/suspects/${index + 1}.webp`}
                                            alt={suspect.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <h4 className="font-semibold text-sm text-white group-hover:text-[#FFFFFF]/80 transition-colors">
                                        {suspect.oneLiner}
                                    </h4>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
