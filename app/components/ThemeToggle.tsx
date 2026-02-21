"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Only render the theme-dependent UI after hydration
    useEffect(() => setMounted(true), []);

    const isDark = resolvedTheme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="p-2 rounded-xl transition-all duration-300 hover:bg-white/10 group relative"
            title={mounted ? `Switch to ${isDark ? "Light" : "Dark"} Mode` : "Toggle theme"}
        >
            {/* Background Glow */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-tr from-blue-500/20 to-purple-500/20 blur-md" />

            <div className="relative z-10 text-slate-400 group-hover:text-blue-400 transition-colors">
                {/* Render a neutral icon until mounted to avoid hydration mismatch */}
                {!mounted ? (
                    <Moon size={20} className="opacity-0" />
                ) : isDark ? (
                    <Moon size={20} className="fill-current/10" />
                ) : (
                    <Sun size={20} className="text-amber-500 fill-current/20" />
                )}
            </div>
        </button>
    );
}
