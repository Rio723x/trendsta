"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Play, Hash, Sparkles, User, TrendingUp, Users, FileText, ChevronLeft, ChevronRight, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import { useSidebar } from "../context/SidebarContext";
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
            className={`hidden md:flex flex-col bg-white border-r border-slate-200 h-screen fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-64"
                }`}
        >
            {/* Logo */}
            <div className={`p-6 flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                {isCollapsed ? (
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                        <TrendingUp className="text-white w-5 h-5" />
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
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                ? "bg-blue-50 text-blue-600 border border-blue-100"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                } ${isCollapsed ? "justify-center" : ""}`}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                            {!isCollapsed && (
                                <span className={`text-sm whitespace-nowrap overflow-hidden ${isActive ? "font-semibold" : "font-medium"}`}>
                                    {item.label}
                                </span>
                            )}

                            {/* Tooltip for collapsed mode */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
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
                className="absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1 shadow-md hover:bg-slate-50 text-slate-500 hover:text-slate-700 z-50"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Stats Summary (Hidden on Collapse) */}
            {/* {!isCollapsed && (
                <div className="px-4 py-4 border-t border-slate-200">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 mb-2">Today&apos;s Focus</p>
                        <p className="text-sm font-semibold text-slate-900 mb-1">Build in Public</p>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-xs text-slate-600">3 scripts ready</p>
                        </div>
                    </div>
                </div>
            )} */}

            {/* User Profile */}
            <div className="p-4 border-t border-slate-200">
                <div className={`flex items-center gap-3 ${isCollapsed ? "flex-col" : ""}`}>
                    <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-all duration-200 ${isCollapsed ? "w-full justify-center" : "flex-1"}`}>
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                            <User size={18} />
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
                                <p className="text-xs text-slate-500 truncate">Free Plan</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className={`group relative p-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 ${isCollapsed ? "w-full" : ""}`}
                        title={isCollapsed ? "Logout" : undefined}
                    >
                        <LogOut size={18} />
                        {/* Tooltip for collapsed mode */}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                                Logout
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </aside>
    );
}
