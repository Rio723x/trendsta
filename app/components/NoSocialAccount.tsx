"use client";

import React from "react";
import { Instagram, Sparkles } from "lucide-react";
import Link from "next/link";

interface NoSocialAccountProps {
    message?: string;
}

export default function NoSocialAccount({ message }: NoSocialAccountProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    <Instagram className="w-10 h-10 text-pink-500" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
            </div>

            <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Connect your Instagram
            </h2>
            <p className="text-slate-500 text-center max-w-sm mb-6">
                {message || "Link your Instagram account to unlock personalized insights and recommendations."}
            </p>

            <Link
                href="/account"
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-purple-600 transition-colors shadow-lg shadow-pink-500/25 flex items-center gap-2"
            >
                <Instagram className="w-5 h-5" />
                Connect Instagram
            </Link>
        </div>
    );
}
