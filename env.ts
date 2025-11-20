/**
 * Type-safe environment variable access
 */

type Network = 'scroll-sepolia';

interface ClientEnv {
    projectId: string;
    network: Network;
}

interface ServerEnv extends ClientEnv {
    openaiApiKey: string;
    privateKey: string;
}

function getClientEnv(): ClientEnv {
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
    const networkEnv = process.env.NEXT_PUBLIC_NETWORK;

    if (!projectId) {
        throw new Error('NEXT_PUBLIC_PROJECT_ID is required. Please set it in your environment variables.');
    }

    const network: Network = 'scroll-sepolia';

    return {
        projectId,
        network,
    };
}

function getServerEnvInternal(): ServerEnv {
    const clientEnv = getClientEnv();
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const privateKey = process.env.PRIVATE_KEY;

    if (!openaiApiKey) {
        throw new Error('OPENAI_API_KEY is required. Please set it in your environment variables.');
    }

    if (!privateKey) {
        throw new Error('PRIVATE_KEY is required. Please set it in your environment variables.');
    }

    return {
        ...clientEnv,
        openaiApiKey,
        privateKey,
    };
}

// Client-side accessible env (safe to use in client components)
export const env = getClientEnv();

// Server-side only env (use this in API routes and server components)
export function getServerEnv(): ServerEnv {
    return getServerEnvInternal();
}
