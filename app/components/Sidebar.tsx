"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Play, Hash, Sparkles, User, TrendingUp, Users, FileText, ChevronLeft, ChevronRight, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import { useSidebar } from "../context/SidebarContext";
import ThemeToggle from "./ThemeToggle";
import { useSession, authClient } from "@/lib/auth-client";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/top-reels", label: "Instagram Reels", icon: Play },
    { href: "/competitors", label: "Competitors", icon: Users },
    { href: "/script-ideas", label: "Script Ideas", icon: FileText },
    { href: "/twitter-insights", label: "Twitter Insights", icon: Hash },
    { href: "/ai-consultant", label: "AI Consultant", icon: Sparkles },
    { href: "/account", label: "Account", icon: Settings },
];


export default function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed, toggleSidebar } = useSidebar();
    const router = useRouter();

    const [name, setName] = useState("");

    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
        }
        else {
            setName("Guest User");
        }
    }, [session])

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
        <aside
            className={`hidden md:flex flex-col neu-convex h-screen fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-64"
                }`}
        >
            {/* Logo */}
            <div className={`p-6 flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                {isCollapsed ? (
                    <div className="w-10 h-10 rounded-xl neu-convex flex items-center justify-center shrink-0">
                        <TrendingUp className="text-blue-600 w-6 h-6" />
                    </div>
                ) : (
                    <div className="relative w-full h-12 flex items-center">
                        <Link href="/">
                            <Image
                                src="/logo3.png"
                                width={150}
                                height={50}
                                alt="Trendsta Logo"
                                className="object-contain"
                            />
                        </Link>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                ? "bg-white/10 border border-white/20 text-blue-400 font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                                } ${isCollapsed ? "justify-center" : ""}`}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                            {!isCollapsed && (
                                <span className="text-sm whitespace-nowrap overflow-hidden">
                                    {item.label}
                                </span>
                            )}

                            {/* Tooltip for collapsed mode */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-1 bg-slate-200 text-slate-600 text-xs rounded-lg neu-convex opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-4 top-20 neu-icon-btn z-50"
            >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* User Profile & Theme Toggle */}
            <div className="p-4 space-y-3">
                <div className={`flex justify-center ${isCollapsed ? "" : "w-full"}`}>
                    <ThemeToggle />
                </div>
                <div className={`flex items-center gap-3 ${isCollapsed ? "flex-col" : ""}`}>
                    <div className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-200 ${isCollapsed ? "w-full justify-center" : "flex-1 neu-convex"}`}>
                        <div className="w-10 h-10 rounded-full neu-icon-btn shrink-0">
                            <User size={18} />
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-slate-700 truncate">{name}</p>
                                <p className="text-xs text-slate-500 truncate">Free Plan</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className={`neu-icon-btn text-slate-500 hover:text-red-500 ${isCollapsed ? "w-10 h-10" : ""}`}
                        title={isCollapsed ? "Logout" : undefined}
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
