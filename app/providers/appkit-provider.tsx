"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { AppKitProvider as ReownAppKitProvider } from "@reown/appkit/react";
import { wagmiAdapter, networks } from "../../config/wagmi";
import { env } from "../../env";

// Create AppKit metadata
const metadata = {
    name: "Crime Files",
    description: "Interactive crime mystery game",
    url: typeof window !== "undefined" ? window.location.origin : "https://crimefiles.app",
    icons: ["/logo.svg"]
};

// Create a QueryClient instance
const queryClient = new QueryClient();

export function AppKitProvider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <ReownAppKitProvider
                    adapters={[wagmiAdapter]}
                    projectId={env.projectId}
                    networks={networks}
                    metadata={metadata}
                    features={{
                        analytics: true
                    }}>
                    {children}
                </ReownAppKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
