"use client";

import Link from "next/link";
import Image from "next/image";
import { use, useEffect, useState, useRef, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { getSuspectById } from "../../../lib/caseData";
import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";

interface SuspectChatPageProps {
    params: Promise<{
        id: string;
    }>;
}

// localStorage helper functions
const getStorageKey = (suspectId: number) => `suspect-chat-${suspectId}`;

const loadChatHistory = (suspectId: number): UIMessage[] => {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(getStorageKey(suspectId));
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error("Error loading chat history:", error);
    }
    return [];
};

const saveChatHistory = (suspectId: number, messages: UIMessage[]) => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(getStorageKey(suspectId), JSON.stringify(messages));
    } catch (error) {
        console.error("Error saving chat history:", error);
    }
};

const clearChatHistory = (suspectId: number) => {
    if (typeof window === "undefined") return;
    try {
        localStorage.removeItem(getStorageKey(suspectId));
    } catch (error) {
        console.error("Error clearing chat history:", error);
    }
};

export default function SuspectChatPage({ params }: SuspectChatPageProps) {
    const { id } = use(params);
    const suspectId = parseInt(id);
    const suspectData = getSuspectById(suspectId);

    const suspect = suspectData
        ? {
              name: suspectData.name
          }
        : {
              name: "Unknown Suspect"
          };

    // Manage input state manually
    const [input, setInput] = useState("");

    // Refs for tracking scroll state and messages
    const containerRef = useRef<HTMLDivElement | null>(null);
    const messagesLoadedRef = useRef(false);
    const lastMessageCountRef = useRef(0);
    const initialScrollDoneRef = useRef(false);
    const userScrolledUpRef = useRef(false);

    // Initialize useChat hook with empty array (fixes hydration mismatch)
    const { messages, sendMessage, status, setMessages } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/chat",
            body: { suspectId }
        }),
        messages: [] // Always start with empty array - server and client match
    });

    const isLoading = status === "streaming" || status === "submitted";
    const isStreaming = status === "streaming";
    const isSubmitted = status === "submitted";

    // Simple scroll to bottom function
    const scrollToBottom = useCallback((smooth = false) => {
        if (!containerRef.current) return;
        const el = containerRef.current;
        el.scrollTo({
            top: el.scrollHeight,
            behavior: smooth ? 'smooth' : 'auto'
        });
    }, []);

    // Simple ref callback - just set the ref and load messages
    const setContainerRef = useCallback((el: HTMLDivElement | null) => {
        containerRef.current = el;
        
        if (el && !messagesLoadedRef.current) {
            // Load messages from localStorage on first client render (fixes hydration)
            const loaded = loadChatHistory(suspectId);
            if (loaded.length > 0) {
                setMessages(loaded);
            }
            messagesLoadedRef.current = true;
        }
    }, [suspectId, setMessages]);

    // Initial scroll on mount/load when messages are first loaded
    useEffect(() => {
        if (!containerRef.current || messages.length === 0) return;
        
        // Only do initial scroll once, when we first have messages
        if (!initialScrollDoneRef.current) {
            // Small delay to ensure DOM is ready
            const timeoutId = setTimeout(() => {
                scrollToBottom(false);
                initialScrollDoneRef.current = true;
                lastMessageCountRef.current = messages.length;
            }, 150);
            
            return () => clearTimeout(timeoutId);
        }
    }, [messages.length, scrollToBottom]);

    // Scroll when new message is added (user sends or receives)
    useEffect(() => {
        if (!containerRef.current || messages.length === 0) return;
        
        const currentCount = messages.length;
        const isNewMessage = currentCount > lastMessageCountRef.current;
        
        if (isNewMessage) {
            lastMessageCountRef.current = currentCount;
            // Scroll immediately when new message is added
            scrollToBottom(false);
        }
    }, [messages.length, scrollToBottom]);

    // Monitor user scroll position
    useEffect(() => {
        const setupScrollListener = () => {
            if (!containerRef.current) return null;
            
            const el = containerRef.current;
            const handleScroll = () => {
                const scrollTop = el.scrollTop;
                const scrollHeight = el.scrollHeight;
                const clientHeight = el.clientHeight;
                
                // User is near bottom (within 100px)
                const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
                userScrolledUpRef.current = !isNearBottom;
            };
            
            el.addEventListener('scroll', handleScroll, { passive: true });
            return () => el.removeEventListener('scroll', handleScroll);
        };
        
        // Try to set up immediately
        let cleanup = setupScrollListener();
        
        // If container not ready, retry after a short delay
        if (!cleanup) {
            const timeoutId = setTimeout(() => {
                cleanup = setupScrollListener();
            }, 100);
            
            return () => {
                clearTimeout(timeoutId);
                if (cleanup) cleanup();
            };
        }
        
        return cleanup;
    }, []);

    // Continuous scroll during streaming
    useEffect(() => {
        if (!isStreaming || !containerRef.current) return;
        
        // Only auto-scroll if user hasn't manually scrolled up
        if (userScrolledUpRef.current) return;
        
        // Use MutationObserver to detect DOM changes
        const observer = new MutationObserver(() => {
            // Throttle scroll calls
            requestAnimationFrame(() => {
                if (!userScrolledUpRef.current && containerRef.current) {
                    scrollToBottom(false);
                }
            });
        });
        
        observer.observe(containerRef.current, {
            childList: true,
            subtree: true,
            characterData: true
        });
        
        // Also use interval as backup (every 100ms during streaming)
        const intervalId = setInterval(() => {
            if (!userScrolledUpRef.current && containerRef.current) {
                scrollToBottom(false);
            }
        }, 100);
        
        return () => {
            observer.disconnect();
            clearInterval(intervalId);
        };
    }, [isStreaming, scrollToBottom]);


    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    // Handle form submit
    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;
        sendMessage({ text: input });
        setInput("");
    };

    // Save messages to localStorage whenever they update
    useEffect(() => {
        if (messages.length > 0) {
            saveChatHistory(suspectId, messages);
        }
    }, [messages, suspectId]);

    // Handle reset chat
    const handleReset = () => {
        if (confirm("Are you sure you want to clear this chat history?")) {
            clearChatHistory(suspectId);
            setMessages([]);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-body flex flex-col">
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 pt-8 pb-4 md:px-12 md:pt-12 md:pb-6 bg-black">
                {/* Back Button - Goes back to suspect detail page */}
                <Link href={`/suspects/${id}`} className="text-white hover:text-gray-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>

                {/* Page Heading */}
                <Link href={`/suspects/${id}/chat`} className="text-xl md:text-2xl font-headline tracking-wide uppercase ml-auto">
                    INTERROGATE
                </Link>
            </nav>

            {/* Main Content Area - Chat UI */}
            <main className="flex-1 bg-black relative overflow-hidden flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-8 px-6 md:px-6 lg:px-12 py-8 md:py-8 pt-24 md:pt-32 min-h-0 max-w-7xl md:mx-auto w-full">
                {/* Chat UI */}
                <div className="w-full md:flex-1 md:max-w-md rounded-lg overflow-hidden flex flex-col h-full md:h-[600px] lg:h-[700px]">
                    {/* Chat Header */}
                    <div className="flex items-center justify-between p-3 md:p-4">
                        <div className="flex items-center gap-2 md:gap-0">
                            <div className="ml-2 md:ml-3">
                                <p className="text-base md:text-lg font-medium text-white font-body tracking-wide">
                                    Hello I am {suspect.name}, how can I help you today?
                                </p>
                            </div>
                        </div>
                        {/* Reset Button */}
                        {/* <button
                            onClick={handleReset}
                            className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm font-body px-2 py-1"
                            title="Clear chat history">
                            Reset
                        </button> */}
                    </div>

                    {/* Chat History */}
                    <div 
                        ref={setContainerRef}
                        className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 pb-20 md:pb-4"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {messages.length > 0 &&
                            messages.map((message) => (
                                <div key={message.id} className={`flex items-start gap-2 md:gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                                    {message.role === "assistant" && (
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 mt-1 md:mt-1.5 overflow-hidden relative">
                                            <Image
                                                src={`/characters/${id}.webp`}
                                                alt={suspect.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-2 md:p-3 rounded-lg max-w-[80%]">
                                        {message.parts.map((part, i) => {
                                            if (part.type === "text") {
                                                return (
                                                    <p
                                                        key={`${message.id}-${i}`}
                                                        className={`text-xs md:text-sm leading-relaxed font-body ${
                                                            message.role === "user" ? "text-white" : "text-gray-300"
                                                        }`}>
                                                        {part.text}
                                                    </p>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            ))}
                        {isSubmitted && !isStreaming && (
                            <div className="flex items-start gap-2 md:gap-3">
                                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 md:mt-1.5 overflow-hidden relative">
                                    <Image
                                        src={`/characters/${id}.webp`}
                                        alt={suspect.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-2 md:p-3 rounded-lg max-w-[80%]">
                                    <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-body">Thinking...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Text Input Area - Desktop: inside chat container */}
                    <div className="hidden md:block p-3 md:p-4">
                        <form onSubmit={handleSubmit} className="flex items-center gap-2 md:gap-3">
                            <input
                                type="text"
                                value={input || ""}
                                onChange={handleInputChange}
                                placeholder="Type your message..."
                                disabled={isLoading}
                                className="flex-1 bg-transparent text-white px-3 md:px-4 py-2 md:py-3 rounded-lg focus:outline-none placeholder-gray-500 text-xs md:text-sm font-body disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input?.trim()}
                                className="text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:text-gray-400 transition-colors text-xs md:text-sm font-body disabled:opacity-50 disabled:cursor-not-allowed">
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            {/* Fixed Text Input Area at Bottom - Mobile only */}
            <div className="fixed bottom-0 left-0 right-0 md:hidden z-20 px-6 pb-6 bg-black">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input || ""}
                        onChange={handleInputChange}
                        placeholder="Ask your question..."
                        disabled={isLoading}
                        className="flex-1 bg-transparent text-white px-4 py-3 rounded-lg focus:outline-none placeholder-gray-500 text-sm font-body disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input?.trim()}
                        className="text-white px-5 py-3 rounded-lg font-medium hover:text-gray-400 transition-colors text-sm font-body disabled:opacity-50 disabled:cursor-not-allowed">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
