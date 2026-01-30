"use client";

import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-xl transition-all duration-300 hover:bg-white/10 group relative"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
            {/* Background Glow */}
            <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-md`} />

            <div className="relative z-10 text-slate-400 group-hover:text-blue-400 transition-colors">
                {theme === 'dark' ? (
                    <Moon size={20} className="fill-current/10" />
                ) : (
                    <Sun size={20} className="text-amber-500 fill-current/20" />
                )}
            </div>
        </button>
    );
}
