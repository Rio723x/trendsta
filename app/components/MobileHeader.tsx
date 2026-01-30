"use client";

import React, { useState, useEffect, useRef } from "react";
import { TrendingUp, Menu, User, LogOut, Home, Play, Users, FileText, Hash, Sparkles, Settings } from "lucide-react";
import Image from "next/image";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/top-reels", label: "Instagram Reels", icon: Play },
    { href: "/competitors", label: "Competitors", icon: Users },
    { href: "/script-ideas", label: "Script Ideas", icon: FileText },
    { href: "/twitter-insights", label: "Twitter Insights", icon: Hash },
    { href: "/ai-consultant", label: "AI Consultant", icon: Sparkles },
    { href: "/account", label: "Account", icon: Settings },
];

export default function MobileHeader(): React.JSX.Element {
    const [showMenu, setShowMenu] = useState(false);
    const [name, setName] = useState("");
    const menuRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
        } else {
            setName("Guest User");
        }
    }, [session]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/signin");
                }
            }
        });
    };

    return (
        <div className="md:hidden flex items-center justify-between p-4 neu-convex sticky top-0 z-40 mb-4 rounded-b-2xl border-b border-white/20">
            <div className="flex items-center gap-2">
                <Image
                    src={"/logo3.png"}
                    width={150}
                    height={40}
                    alt="logo"
                    style={{ objectFit: 'contain' }}
                />
            </div>
            <div className="relative flex items-center gap-2" ref={menuRef}>
                <ThemeToggle />
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="neu-icon-btn text-slate-600 ml-2"
                >
                    <Menu size={24} />
                </button>

                {showMenu && (
                    <div className="absolute right-0 top-12 mt-2 w-64 neu-convex z-50 animate-fadeInUp p-4">
                        {/* Navigation Links */}
                        <div className="space-y-2 mb-4">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setShowMenu(false)}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                                            ? "neu-pressed text-blue-600"
                                            : "text-slate-600 hover:neu-convex"
                                            }`}
                                    >
                                        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="p-4 border-t border-slate-200/50 mt-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full neu-pressed flex items-center justify-center text-slate-600">
                                    <User size={20} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-semibold text-slate-700 truncate">{name}</p>
                                    <p className="text-xs text-slate-500 truncate">Free Plan</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-slate-500 hover:text-red-500 neu-convex rounded-xl"
                            >
                                <LogOut size={18} />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
