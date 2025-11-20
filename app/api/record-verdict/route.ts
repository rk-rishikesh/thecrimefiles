import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, http, createPublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { scrollSepolia } from 'viem/chains';
import { contractAddress, contractABI } from '../../../constant/contract';
import { getServerEnv } from '../../../env';

export async function POST(req: NextRequest) {
    try {
        const { userAddress, suspectID } = await req.json();

        if (!userAddress) {
            return NextResponse.json(
                { error: 'User address is required' },
                { status: 400 }
            );
        }

        if (!suspectID) {
            return NextResponse.json(
                { error: 'Suspect ID is required' },
                { status: 400 }
            );
        }

        const serverEnv = getServerEnv();
        const chain = scrollSepolia;

        // Create account from private key
        const account = privateKeyToAccount(serverEnv.privateKey as `0x${string}`);

        // Create public client for reading
        const publicClient = createPublicClient({
            chain,
            transport: http(),
        });

        // Create wallet client for signing and sending
        const walletClient = createWalletClient({
            account,
            chain,
            transport: http(),
        });

        // Send transaction
        const hash = await walletClient.writeContract({
            address: contractAddress as `0x${string}`,
            abi: contractABI,
            functionName: 'recordVerdict',
            args: [userAddress as `0x${string}`, suspectID],
        });

        // Wait for transaction receipt
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        // Convert BigInt values to strings for JSON serialization
        const serializedReceipt = {
            blockNumber: receipt.blockNumber.toString(),
            blockHash: receipt.blockHash,
            transactionHash: receipt.transactionHash,
            transactionIndex: receipt.transactionIndex.toString(),
            from: receipt.from,
            to: receipt.to,
            contractAddress: receipt.contractAddress,
            gasUsed: receipt.gasUsed.toString(),
            cumulativeGasUsed: receipt.cumulativeGasUsed.toString(),
            effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
            status: receipt.status,
            type: receipt.type,
            logs: receipt.logs.map(log => ({
                address: log.address,
                topics: log.topics,
                data: log.data,
                blockNumber: log.blockNumber.toString(),
                blockHash: log.blockHash,
                transactionHash: log.transactionHash,
                logIndex: log.logIndex.toString(),
                transactionIndex: log.transactionIndex.toString(),
                removed: log.removed,
            })),
        };

        return NextResponse.json({
            success: true,
            transactionHash: hash,
            receipt: serializedReceipt,
        });
    } catch (error) {
        console.error('Error in record-verdict API:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}

