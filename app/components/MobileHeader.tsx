"use client";

import React, { useState, useEffect, useRef } from "react";
import { TrendingUp, Menu, User, LogOut } from "lucide-react";
import Image from "next/image";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function MobileHeader(): React.JSX.Element {
    const [showMenu, setShowMenu] = useState(false);
    const [name, setName] = useState("");
    const menuRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();
    const router = useRouter();

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
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 bg-white sticky top-0 z-40 shadow-sm">
            <div className="flex items-center gap-2">
                <Image
                    src={"/logo3.png"}
                    width={150}
                    height={40}
                    alt="logo"
                    style={{ objectFit: 'contain' }}
                />
            </div>
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
                >
                    <Menu size={24} />
                </button>

                {showMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
                        <div className="p-4 border-b border-slate-200 bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                                    <User size={20} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
                                    <p className="text-xs text-slate-500 truncate">Free Plan</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            <LogOut size={18} />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
