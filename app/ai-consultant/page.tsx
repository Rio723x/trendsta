"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import { Send, Sparkles, TrendingUp, Menu, Zap, BrainCircuit, History, ArrowRight, User, Paperclip, Mic, MicOff, Volume2, VolumeX, Target, ScrollText, Copy, Check, Lightbulb, BarChart3, Users, Hash, PenTool, Calendar, HelpCircle, FileText, Instagram } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import InlineChart, { InlineChartError } from "../components/InlineChart";
import { parseGraphBlocks, ContentPart } from "@/lib/consultant/graphParser";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useUsage } from "@/hooks/useUsage";
import { useResearch } from "@/hooks/useResearch";

// ============================================================
// TYPES
// ============================================================
type Message = {
    id: number;
    role: "user" | "assistant";
    content: string;
    isStreaming?: boolean;
};

// ============================================================
// PROMPT SUGGESTIONS
// ============================================================
const PROMPT_SUGGESTIONS = [
    { icon: TrendingUp, label: "Trending Analysis", prompt: "Analyze trending topics in my niche and give me content ideas", color: "from-blue-500 to-cyan-500" },
    { icon: Lightbulb, label: "Viral Ideas", prompt: "Generate 3 viral reel ideas with hooks for AI/Tech niche", color: "from-amber-500 to-orange-500" },
    { icon: Users, label: "Competitor Intel", prompt: "Analyze my competitors' strategies and what's working for them", color: "from-purple-500 to-pink-500" },
    { icon: BarChart3, label: "My Performance", prompt: "How are my recent reels performing? What should I improve?", color: "from-green-500 to-emerald-500" },
    { icon: Hash, label: "Hashtag Strategy", prompt: "Suggest the best performing hashtags for my next post", color: "from-rose-500 to-red-500" },
    { icon: PenTool, label: "Script Writing", prompt: "Write a viral reel script about AI tools with a strong hook", color: "from-indigo-500 to-violet-500" },
];

// ============================================================
// MARKDOWN RENDERER WITH STYLED COMPONENTS
// ============================================================
function MarkdownContent({ content }: { content: string }) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                // Headers
                h1: ({ children }) => <h1 className="text-xl font-bold text-theme-primary mt-4 mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold text-theme-primary mt-4 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-bold text-theme-secondary mt-3 mb-1.5">{children}</h3>,
                h4: ({ children }) => <h4 className="text-sm font-bold text-theme-muted mt-2 mb-1">{children}</h4>,
                // Paragraphs
                p: ({ children }) => <p className="text-sm md:text-base leading-relaxed mb-3 last:mb-0 text-theme-secondary">{children}</p>,
                // Strong/Bold
                strong: ({ children }) => <strong className="font-semibold text-theme-primary">{children}</strong>,
                // Italic/Emphasis
                em: ({ children }) => <em className="italic text-theme-muted">{children}</em>,
                // Lists
                ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 my-2 ml-2 text-theme-secondary">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 my-2 ml-2 text-theme-secondary">{children} </ol>,
                li: ({ children }) => <li className="text-sm md:text-base leading-relaxed">{children}</li>,
                // Blockquotes
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 glass-inset-bg pl-4 py-2 my-3 italic text-theme-muted rounded-r-lg">
                        {children}
                    </blockquote>
                ),
                // Code
                code: ({ className, children }) => {
                    const isInline = !className;
                    if (isInline) {
                        return <code className="bg-white/10 text-blue-400 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>;
                    }
                    return (
                        <code className="block bg-black/40 text-slate-200 p-4 rounded-lg text-sm font-mono overflow-x-auto my-3 border border-white/5">
                            {children}
                        </code>
                    );
                },
                pre: ({ children }) => <pre className="my-0">{children}</pre>,
                // Links
                a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                        {children}
                    </a>
                ),
                // Horizontal Rule
                hr: () => <hr className="my-4 border-white/10" />,
            }}
        >
            {content}
        </ReactMarkdown>
    );
}

// ============================================================
// CHAT MESSAGE WITH STREAMING, MARKDOWN, AND TTS
// ============================================================
function ChatMessage({
    message,
    displayedContent,
    onSpeak,
    isSpeaking
}: {
    message: Message;
    displayedContent: string;
    onSpeak: (text: string) => void;
    isSpeaking: boolean;
}) {
    const isUser = message.role === "user";
    const [copied, setCopied] = useState(false);

    // Parse content for GRAPH blocks (only for assistant messages)
    // Skip incomplete graph blocks during streaming
    const contentParts: ContentPart[] = isUser
        ? [{ type: 'text', content: displayedContent }]
        : parseGraphBlocks(displayedContent).filter(part => {
            // Filter out graph errors during streaming (incomplete blocks)
            if (part.type === 'graph' && part.error && message.isStreaming) {
                return false;
            }
            return true;
        });

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}
        >
            <div className={`relative group max-w-[85%] md:max-w-[75%]`}>
                {/* Avatar for AI */}
                {!isUser && (
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                            <Image src="/T_logo.png" alt="Trendsta" width={24} height={24} className="object-contain" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-xs font-bold text-theme-muted">Trendsta AI</span>
                                {message.isStreaming && (
                                    <span className="flex items-center gap-1">
                                        <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </span>
                                )}
                            </div>
                            <div className="glass-panel px-4 py-3 rounded-2xl rounded-tl-md shadow-sm">
                                {/* Render content parts (text with markdown and graphs) */}
                                {contentParts.map((part, index) => (
                                    <div key={index}>
                                        {part.type === 'text' && part.content && (
                                            <MarkdownContent content={part.content} />
                                        )}
                                        {part.type === 'graph' && part.spec && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <InlineChart spec={part.spec} />
                                            </motion.div>
                                        )}
                                    </div>
                                ))}
                                {/* Streaming cursor */}
                                {message.isStreaming && (
                                    <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-0.5"></span>
                                )}
                            </div>
                            {/* Action buttons */}
                            {!message.isStreaming && (
                                <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={handleCopy}
                                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                        title="Copy"
                                    >
                                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                    </button>
                                    <button
                                        onClick={() => onSpeak(message.content)}
                                        className={`p-1.5 rounded-lg transition-colors ${isSpeaking ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                                        title={isSpeaking ? "Stop speaking" : "Read aloud"}
                                    >
                                        {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* User message */}
                {isUser && (
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-lg">
                        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{displayedContent}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ============================================================
// MAIN AI CONSULTANT PAGE
// ============================================================
export default function AIConsultantPage() {
    const { isCollapsed } = useSidebar();
    const [messages, setMessages] = useState<Message[]>([]);
    const [displayedContents, setDisplayedContents] = useState<Record<number, string>>({});
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasStartedChat, setHasStartedChat] = useState(false);
    const [thinkingMode, setThinkingMode] = useState<"flash" | "deep">("flash");
    const [showHistory, setShowHistory] = useState(false);
    const [chatId, setChatId] = useState<string | null>(null);

    // Voice states
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);

    // Initial Data & Hooks
    const { planTier } = useUsage();
    const { data: researchData } = useResearch();

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
    const userScrolledUpRef = useRef(false);

    // Smart scroll - only auto-scroll if user is at bottom
    const scrollToBottom = useCallback(() => {
        if (!userScrolledUpRef.current && chatContainerRef.current) {
            // Use scrollTop instead of scrollIntoView for more control
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, []);

    // Track user scroll to allow them to read while streaming
    const handleScroll = useCallback(() => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            // User is considered "scrolled up" if more than 200px from bottom
            // Larger threshold to prevent accidental re-scrolling
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
            userScrolledUpRef.current = distanceFromBottom > 200;
        }
    }, []);

    // Auto-scroll during streaming (respects user scroll position)
    useEffect(() => {
        // Only auto-scroll if user hasn't scrolled up
        if (!userScrolledUpRef.current) {
            scrollToBottom();
        }
    }, [displayedContents, scrollToBottom]);

    // Reset scroll state when user sends message
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'user') {
                userScrolledUpRef.current = false;
            }
        }
    }, [messages.length]);

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                setInput(transcript);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = () => {
                setIsListening(false);
            };
        }
    }, []);

    // Toggle speech recognition
    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not supported in your browser.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    // Text-to-speech
    const speak = useCallback((text: string, messageId?: number) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        // Stop any ongoing speech
        window.speechSynthesis.cancel();

        if (isSpeaking && speakingMessageId === messageId) {
            setIsSpeaking(false);
            setSpeakingMessageId(null);
            return;
        }

        // Strip markdown for cleaner speech
        const cleanText = text
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/#{1,6}\s/g, '')
            .replace(/`{1,3}/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/```[\s\S]*?```/g, 'code block')
            .replace(/```GRAPH[\s\S]*?```/g, 'chart visualization');


        const utterance = new SpeechSynthesisUtterance(cleanText);
        //SPEAKING PACE HERE---------------------------------------------
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onend = () => {
            setIsSpeaking(false);
            setSpeakingMessageId(null);
        };

        synthRef.current = utterance;
        setIsSpeaking(true);
        if (messageId) setSpeakingMessageId(messageId);
        window.speechSynthesis.speak(utterance);
    }, [isSpeaking, speakingMessageId]);

    // Improved streaming effect - smooth word by word like Gemini
    const streamContent = useCallback((messageId: number, fullContent: string) => {
        // Parse content into segments that respect GRAPH blocks
        const segments: string[] = [];

        // Case-insensitive regex to find all graph blocks (```graph or ```GRAPH)
        const graphRegex = /```[Gg][Rr][Aa][Pp][Hh][\s\S]*?```/g;
        let lastIndex = 0;
        let match;

        while ((match = graphRegex.exec(fullContent)) !== null) {
            // Add text before graph as words
            if (match.index > lastIndex) {
                const textBefore = fullContent.substring(lastIndex, match.index);
                // Split by words but keep the spaces attached
                const words = textBefore.split(/(?<=\s)/).filter(w => w);
                segments.push(...words);
            }
            // Add entire graph block as single segment (marked for special handling)
            segments.push('__GRAPH_BLOCK__' + match[0]);
            lastIndex = match.index + match[0].length;
        }

        // Add remaining text as words
        if (lastIndex < fullContent.length) {
            const remainingText = fullContent.substring(lastIndex);
            const words = remainingText.split(/(?<=\s)/).filter(w => w);
            segments.push(...words);
        }

        let segmentIndex = 0;
        let currentContent = '';

        const stream = () => {
            if (segmentIndex < segments.length) {
                const currentSegment = segments[segmentIndex];

                // Check if this is a graph block (skip incomplete ones)
                if (currentSegment.startsWith('__GRAPH_BLOCK__')) {
                    // Add the graph block content (remove the marker)
                    currentContent += currentSegment.replace('__GRAPH_BLOCK__', '');
                    segmentIndex++;
                } else {
                    // Add multiple words per tick for smooth, fast streaming
                    const wordsPerTick = 4;
                    for (let i = 0; i < wordsPerTick && segmentIndex < segments.length; i++) {
                        const seg = segments[segmentIndex];
                        if (seg.startsWith('__GRAPH_BLOCK__')) break;
                        currentContent += seg;
                        segmentIndex++;
                    }
                }

                setDisplayedContents(prev => ({
                    ...prev,
                    [messageId]: currentContent
                }));

                if (segmentIndex < segments.length) {
                    // 15ms interval for smoother, natural streaming feel
                    setTimeout(stream, 15);
                } else {
                    // Streaming complete
                    setMessages(prev => prev.map(m =>
                        m.id === messageId ? { ...m, isStreaming: false } : m
                    ));
                }
            }
        };

        stream();
    }, []);

    const handleSend = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText || isLoading) return;

        setHasStartedChat(true);

        // Add user message
        const userMessage: Message = {
            id: Date.now(),
            role: "user",
            content: messageText,
        };
        setMessages((prev) => [...prev, userMessage]);
        setDisplayedContents(prev => ({ ...prev, [userMessage.id]: messageText }));
        setInput("");
        setIsLoading(true);

        // Stop listening if active
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }

        try {
            const modelMode = thinkingMode === 'flash' ? 'fast' : 'thinking';

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: messageText,
                    chatId: chatId,
                    modelMode: modelMode,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to get response');
            }

            const data = await response.json();

            if (data.chatId && !chatId) {
                setChatId(data.chatId);
            }

            const aiMessage: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content: data.message,
                isStreaming: true,
            };

            setMessages((prev) => [...prev, aiMessage]);
            setDisplayedContents(prev => ({ ...prev, [aiMessage.id]: '' }));

            // Start streaming effect
            setTimeout(() => streamContent(aiMessage.id, data.message), 100);

        } catch (error) {
            console.error('Chat API error:', error);
            const errorMessage: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content: `⚠️ Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
            };
            setMessages((prev) => [...prev, errorMessage]);
            setDisplayedContents(prev => ({ ...prev, [errorMessage.id]: errorMessage.content }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSpeakMessage = (messageId: number) => {
        const message = messages.find(m => m.id === messageId);
        if (message) {
            speak(message.content, messageId);
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-slate-900 font-sans selection:bg-blue-200">
            <Sidebar />
            <MobileHeader />

            {/* History Sidebar */}
            <div className={`fixed right-0 top-0 bottom-0 w-80 bg-[var(--bg-primary)] border-l border-[var(--glass-border)] z-50 transform transition-transform duration-300 shadow-2xl ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between">
                    <h3 className="font-bold text-theme-primary tracking-tight">Chat History</h3>
                    <button onClick={() => setShowHistory(false)} className="p-1.5 text-theme-muted hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all">
                        <ArrowRight size={20} />
                    </button>
                </div>
                <div className="p-4 space-y-3 overflow-y-auto h-[calc(100vh-65px)]">
                    <div className="p-3 bg-[var(--glass-surface)] hover:bg-[var(--glass-surface-hover)] rounded-xl cursor-pointer transition-all border border-[var(--glass-border)] group">
                        <p className="text-sm font-semibold text-theme-primary truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">Current Session</p>
                        <p className="text-[10px] uppercase font-bold text-theme-muted tracking-wider mt-1">Just now</p>
                    </div>
                </div>
            </div>

            <main
                className={`transition-all duration-300 ease-in-out flex flex-col items-center relative ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}
                style={{ height: '100vh', maxHeight: '100vh' }}
            >
                {showHistory && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setShowHistory(false)} />
                )}

                {/* Top Bar with Logo */}
                <div className="w-full max-w-4xl flex items-center justify-between px-6 py-4 z-10">
                    {hasStartedChat ? (
                        <div className="flex items-center gap-2">
                            <Image src="/logo3.png" alt="Trendsta" width={100} height={28} className="opacity-80" />
                        </div>
                    ) : (
                        <div />
                    )}
                    <button
                        onClick={() => setShowHistory(true)}
                        className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View History"
                    >
                        <History size={20} />
                    </button>
                </div>

                {/* Main Content Area */}
                <div className={`flex-1 w-full max-w-4xl flex flex-col overflow-hidden ${hasStartedChat ? 'pb-48' : 'justify-center items-center pb-32'}`}>

                    {/* Landing State */}
                    <AnimatePresence>
                        {!hasStartedChat && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                className="text-center px-4"
                            >
                                {/* Logo */}
                                <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                                    <Image
                                        src="/T_logo.png"
                                        width={80}
                                        height={80}
                                        alt="Trendsta Logo"
                                        className="object-contain"
                                    />
                                </div>

                                <p className="text-theme-secondary text-lg mb-2 max-w-md mx-auto">
                                    Your AI-powered content strategist. Ask me anything about reels, trends, and growth.
                                </p>

                                {/* Research Date Note */}
                                {researchData && researchData.createdAt && (
                                    <div className="mb-8 max-w-md mx-auto">
                                        <p className="text-xs text-theme-muted bg-white/5 inline-block px-3 py-1 rounded-full border border-white/10">
                                            📊 Results based on data from {new Date(researchData.createdAt).toLocaleDateString()}.
                                            <span className="opacity-70 ml-1">Analyse again for fresh results.</span>
                                        </p>
                                    </div>
                                )}

                                {/* Prompt Suggestions Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                                    {PROMPT_SUGGESTIONS.map((item, i) => (
                                        <motion.button
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + i * 0.05 }}
                                            onClick={() => handleSend(item.prompt)}
                                            className="group relative glass-panel hover:bg-white/10 border-transparent hover:border-white/20 p-4 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                                        >
                                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                                <item.icon size={16} className="text-white" />
                                            </div>
                                            <p className="text-sm font-medium text-theme-secondary leading-tight group-hover:text-theme-primary">{item.label}</p>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Chat Messages */}
                    {hasStartedChat && (
                        <div
                            ref={chatContainerRef}
                            onScroll={handleScroll}
                            className="flex-1 w-full overflow-y-auto px-4 md:px-6 py-4 space-y-2"
                        >
                            <div className="h-4" />
                            {messages.map((message) => (
                                <ChatMessage
                                    key={message.id}
                                    message={message}
                                    displayedContent={displayedContents[message.id] || message.content}
                                    onSpeak={() => handleSpeakMessage(message.id)}
                                    isSpeaking={speakingMessageId === message.id}
                                />
                            ))}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                            <Image src="/T_logo.png" alt="Trendsta" width={24} height={24} className="object-contain" />
                                        </div>
                                        <div className="glass-panel px-4 py-3 rounded-2xl rounded-tl-md shadow-sm flex items-center gap-2">
                                            {thinkingMode === 'flash' ? (
                                                <Zap size={16} className="text-amber-500 animate-pulse" />
                                            ) : (
                                                <BrainCircuit size={16} className="text-purple-500 animate-pulse" />
                                            )}
                                            <span className="text-sm text-theme-muted">
                                                {thinkingMode === 'flash' ? 'Thinking...' : 'Deep analyzing...'}
                                            </span>
                                            <span className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className={`w-full max-w-4xl z-20 px-4 md:px-6 ${hasStartedChat ? 'fixed bottom-0 pb-6 pt-4' : 'relative'}`}>
                    <div className="relative">
                        {/* Main Input */}
                        <div className="bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 p-2 rounded-2xl shadow-xl flex items-center gap-2 transition-all duration-300 focus-within:bg-white/60 dark:focus-within:bg-white/10 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500/40">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask Trendsta anything..."
                                className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-base p-3 min-h-[48px] max-h-[120px] resize-none text-theme-primary placeholder-theme-muted"
                                rows={1}
                            />

                            {/* Mic Button */}
                            <button
                                onClick={toggleListening}
                                className={`p-2.5 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-theme-muted hover:text-theme-primary hover:bg-white/10'}`}
                                title={isListening ? "Stop listening" : "Voice input"}
                            >
                                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>

                            {/* Send Button */}
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isLoading}
                                className={`p-2.5 rounded-xl transition-all ${input.trim() && !isLoading ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105' : 'bg-white/5 text-slate-600'}`}
                            >
                                <ArrowRight size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex justify-center mt-3 gap-2">
                        <button
                            onClick={() => setThinkingMode('flash')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${thinkingMode === 'flash' ? 'bg-amber-50 border border-amber-200 text-amber-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                        >
                            <Zap size={14} className={thinkingMode === 'flash' ? 'text-amber-500' : ''} />
                            Fast Mode
                        </button>

                        {/* Pro/Thinking Modes - Locked for Tier 1 & 2 */}
                        <div className="relative group/mode">
                            <button
                                onClick={() => {
                                    if (planTier >= 3) setThinkingMode('deep');
                                }}
                                disabled={planTier < 3}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${planTier < 3
                                    ? 'opacity-50 cursor-not-allowed bg-slate-100/5 text-slate-400'
                                    : thinkingMode === 'deep'
                                        ? 'bg-purple-50 border border-purple-200 text-purple-700 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                <BrainCircuit size={14} className={thinkingMode === 'deep' ? 'text-purple-500' : ''} />
                                Deep Research
                                {planTier < 3 && <Target size={12} className="ml-1 text-slate-400" />}
                            </button>
                            {planTier < 3 && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover/mode:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    Requires Platinum Plan
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
