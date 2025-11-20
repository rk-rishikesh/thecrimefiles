"use client";

import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import { getEvidenceById } from "../../lib/caseData";

interface EvidenceDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EvidenceDetailPage({ params }: EvidenceDetailPageProps) {
    const { id } = use(params);
    const evidenceData = getEvidenceById(id);

    const evidence = evidenceData ? {
        title: evidenceData.name,
        type: evidenceData.type,
        description: evidenceData.description,
        status: evidenceData.status,
        fullDescription: evidenceData.fullDescription,
        collectedDate: evidenceData.collectedDate,
        collectedTime: evidenceData.collectedTime,
        location: evidenceData.foundAt || "Unknown"
    } : {
        title: "Unknown Evidence",
        type: "Unknown",
        description: "No information available",
        status: "Unknown",
        fullDescription: "No detailed information available for this evidence item.",
        collectedDate: "Unknown",
        collectedTime: "Unknown",
        location: "Unknown"
    };

    return (
        <div className="min-h-screen bg-black text-white font-body">
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 pt-8 pb-4 md:px-12 md:pt-12 md:pb-6 bg-black">
                {/* Back Button */}
                <Link href="/evidence" className="text-white hover:text-gray-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>

            {/* Page Heading */}
            <Link href="/evidence" className="text-xl md:text-2xl font-headline tracking-wide uppercase text-white hover:text-gray-300 transition-colors ml-auto">
                {evidence.title}
            </Link>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 md:px-12 py-8 pt-24 md:pt-32">
            
                {/* Back Button - Desktop */}
                <div className="hidden md:block mb-8">
                    <Link href="/evidence" className="text-white hover:text-gray-400 transition-colors inline-flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-body">Back to Evidence</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Side - Evidence Image */}
                    <div className="w-full">
                        <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-800 relative overflow-hidden">
                            <Image
                                src={`/evidence/${id}.svg`}
                                alt={evidence.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Right Side - Evidence Details */}
                    <div className="flex flex-col">
                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-4 font-headline text-white">
                            {evidence.title}
                        </h1>

                        {/* Type and Status */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-sm uppercase tracking-wide text-gray-400 font-body">{evidence.type}</span>
                            <span className="text-sm uppercase tracking-wide px-3 py-1 bg-gray-800 text-gray-300 font-body">
                                {evidence.status}
                            </span>
                        </div>

                        {/* Full Description */}
                        <div className="mb-8">
                            <h2 className="text-lg font-bold uppercase tracking-wide mb-3 font-headline text-white">Description</h2>
                            <p className="text-gray-300 leading-relaxed font-body">
                                {evidence.fullDescription}
                            </p>
                        </div>

                        {/* Evidence Details */}
                        <div className="flex w-full justify-between gap-6 md:gap-8">
                            <div className="text-left">
                                <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-1 font-headline">Collected Date</h3>
                                <p className="text-white font-body">{evidence.collectedDate}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-1 font-headline">Collected Time</h3>
                                <p className="text-white font-body">{evidence.collectedTime}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
