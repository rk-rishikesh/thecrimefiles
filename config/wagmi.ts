import { cookieStorage, createStorage } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { scrollSepolia } from 'viem/chains';
import { env } from '../env';

// Define Scroll Sepolia network for AppKit
// AppKit expects networks in a specific format compatible with wagmi chains
const scrollSepoliaNetwork = {
    id: scrollSepolia.id,
    name: scrollSepolia.name,
    nativeCurrency: scrollSepolia.nativeCurrency,
    rpcUrls: {
        default: {
            http: scrollSepolia.rpcUrls.default.http,
        },
    },
    blockExplorers: {
        default: {
            name: scrollSepolia.blockExplorers?.default?.name || 'ScrollScan',
            url: scrollSepolia.blockExplorers?.default?.url || 'https://sepolia.scrollscan.com',
        },
    },
} as const;

// Get networks based on environment variable
export const networks = [scrollSepoliaNetwork] as [typeof scrollSepoliaNetwork, ...typeof scrollSepoliaNetwork[]];

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage,
    }),
    ssr: true,
    projectId: env.projectId,
    networks,
});

export const config = wagmiAdapter.wagmiConfig;

