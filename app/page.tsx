"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import { useAccount, useReadContract } from "wagmi";
import { getCaseData } from "./lib/caseData";
import { contractAddress, contractABI } from "../constant/contract";

export default function Home() {
    const router = useRouter();
    const caseData = getCaseData();
    const { isConnected } = useAppKitAccount();
    const { open } = useAppKit();
    const { address } = useAccount();
    const [isCheckingConnection, setIsCheckingConnection] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Check if user is registered
    const { data: isRegistered } = useReadContract({
        address: contractAddress as `0x${string}`,
        abi: contractABI,
        functionName: 'isRegistered',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && isConnected,
        },
    });

    // Check connection status
    useEffect(() => {
        // Connection status has been determined (isConnected is either true or false, not undefined)
        if (isConnected !== undefined) {
            setIsCheckingConnection(false);
        }
    }, [isConnected]);

    const handleOpenCrimeFile = async () => {
        if (!address) return;
        
        // If already registered, navigate directly to casestory
        if (isRegistered) {
            router.replace("/casestory");
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await fetch('/api/open-crime-file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userAddress: address }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Failed to open crime file' }));
                console.error("Error calling openCrimeFile:", errorData.error || 'Failed to open crime file');
            } else {
                const data = await response.json();
                // Transaction successful
            }
        } catch (error) {
            console.error("Error calling openCrimeFile:", error);
        } finally {
            setIsLoading(false);
            // Navigate to casestory regardless of success or error
            router.replace("/casestory");
        }
    };

    const handleInvestigateClick = () => {
        if (!isConnected) {
            open();
        } else {
            handleOpenCrimeFile();
        }
    };

    // Show loading screen while checking connection status
    if (isCheckingConnection) {
        return (
            <div className="h-screen overflow-hidden text-white flex flex-col items-center justify-center" style={{ fontFamily: "var(--font-lato)", height: "100dvh" }}>
                {/* Background Image Container - Fixed full screen */}
                <div className="fixed inset-0 z-0">
                    <Image src="/assets/backgrounds/home.webp" alt="Background" fill className="object-cover" priority />
                    {/* Black Overlay */}
                    <div className="absolute inset-0 opacity-60"></div>
                </div>

                {/* Loading Content */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                    <Image src="/logo.svg" alt="DetectIT" width={200} height={200} className="mb-8" />
                    <Image src="/assets/loader/loader.gif" alt="Loading" width={50} height={50} />
                </div>
            </div>
        );
    }
    return (
        <div className="h-screen overflow-hidden text-white flex flex-col" style={{ fontFamily: "var(--font-lato)", height: "100dvh" }}>
            {/* Navigation Bar - Fixed on mobile */}
            <nav className="fixed top-0 left-0 right-0 sm:relative flex items-center justify-center px-6 pt-4 pb-2 md:px-12 md:pt-6 md:pb-3 z-30 shrink-0">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="DetectIT" width={200} height={200} />
                </Link>
            </nav>

            {/* Background Image Container - Fixed full screen */}
            <div className="fixed inset-0 z-0">
                <Image src="/assets/backgrounds/home.webp" alt="Background" fill className="object-cover" priority />
                {/* Black Overlay */}
                <div className="absolute inset-0 opacity-60"></div>
            </div>

            {/* Hero Section */}
            <main className="relative flex-1 overflow-hidden flex items-end px-6 md:px-12 lg:px-16 pb-6 sm:pt-0 sm:pb-6 md:pb-12 lg:pb-16 z-10">
                {/* Content Container */}
                <div className="relative z-10 w-full max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
                        {/* Left Side - Main Content */}
                        <div className="flex-1 mb-4 sm:mb-6 lg:mb-0">
                            <h1
                                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase tracking-tight mb-2 sm:mb-3 md:mb-4 leading-tight font-headline"
                                style={{ fontFamily: "var(--font-oswald)" }}>
                                {caseData.caseName}
                            </h1>
                            <p
                                className="text-base sm:text-lg md:text-xl lg:text-2xl uppercase tracking-wide mb-4 sm:mb-6 md:mb-8 text-[#EDEDED]"
                                style={{ fontFamily: "var(--font-oswald)" }}>
                                <span>Are you ready to investigate?</span>
                            </p>

                            {/* Call-to-Action Buttons - Hidden on mobile, visible on desktop */}
                            <div className="hidden sm:flex flex-col sm:flex-row gap-4 sm:gap-6">
                                <button onClick={handleInvestigateClick} className="btn-interrogate uppercase tracking-wide w-full sm:w-auto">
                                    <span>{isConnected ? "OPEN FILE" : "INVESTIGATE"}</span>
                                </button>
                            </div>

                            {/* Mobile Button */}
                            <div className="sm:hidden">
                                <button onClick={handleInvestigateClick} className="btn-interrogate uppercase tracking-wide w-full">
                                    <span>{isConnected ? "OPEN FILE" : "INVESTIGATE"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
