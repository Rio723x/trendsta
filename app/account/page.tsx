"use client";

import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SidebarContext";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import {
    ChevronDown,
    Check,
    Save,
    Zap,
    Lock,
    Plus,
    X,
    Languages,
    PenTool,
    ArrowLeft,
    Settings,
    LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { NICHE_OPTIONS, SUB_NICHE_MAPPING } from "../onboarding/onboardingData";

interface Subscription {
    id: string;
    status: string;
    currentPeriodEnd: string;
    plan: {
        id: string;
        name: string;
        tier: number;
        productId: string;
    };
}

const countryCodes = [
    { code: "+1", country: "US", flag: "🇺🇸" },
    { code: "+1", country: "CA", flag: "🇨🇦" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+91", country: "IN", flag: "🇮🇳" },
    { code: "+86", country: "CN", flag: "🇨🇳" },
    { code: "+81", country: "JP", flag: "🇯🇵" },
    { code: "+49", country: "DE", flag: "🇩🇪" },
    { code: "+33", country: "FR", flag: "🇫🇷" },
    { code: "+61", country: "AU", flag: "🇦🇺" },
    { code: "+971", country: "AE", flag: "🇦🇪" },
];

const chevronSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`;
const selectBg = {
    backgroundImage: chevronSvg,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 1rem center",
    backgroundSize: "1.25rem",
} as React.CSSProperties;

// ── Shared label class ────────────────────────────────────────────────────────
const labelCls = "block text-sm font-medium text-theme-primary mb-2";

export default function AccountPage() {
    const { isCollapsed } = useSidebar();
    const router = useRouter();
    const { data: session } = useSession();

    const isGuest = !session?.user;

    // Redirect guest to signin immediately
    useEffect(() => {
        // give authClient time to load, if we don't have a session at all, we can't redirect instantly
        if (session !== undefined && isGuest) {
            router.push("/signin");
        }
    }, [isGuest, session, router]);

    const [firstName, setFirstName] = useState("John");
    const [lastName, setLastName] = useState("Doe");
    const [email, setEmail] = useState("john.doe@example.com");
    const [phoneCode, setPhoneCode] = useState("+1");
    const [phoneNumber, setPhoneNumber] = useState("555-0123");
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const [instagramUsername, setInstagramUsername] = useState("");
    const [niche, setNiche] = useState("");
    const [subNiche, setSubNiche] = useState("");

    const [autoCompetitors, setAutoCompetitors] = useState<string[]>([]);
    const [autoNewCompetitor, setAutoNewCompetitor] = useState("");
    const [autoWritingStyle, setAutoWritingStyle] = useState("let ai decide");
    const [autoScriptLanguage, setAutoScriptLanguage] = useState("English");
    const [autoCaptionLanguage, setAutoCaptionLanguage] = useState("English");

    const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
    const [showPhoneCodeDropdown, setShowPhoneCodeDropdown] = useState(false);
    const phoneDropdownRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (session?.user) {
            if (!firstName || firstName === "John") setFirstName(session.user.name?.split(" ")[0] || "");
            if (!lastName || lastName === "Doe") setLastName(session.user.name?.split(" ").slice(1).join(" ") || "");
            setEmail(session.user.email || "");

            fetch("/api/user/profile")
                .then((r) => r.json())
                .then((data) => {
                    if (data.niche) setNiche(data.niche);
                    if (data.subNiche) setSubNiche(data.subNiche);
                    if (data.instagramUsername) setInstagramUsername(data.instagramUsername);
                    if (data.automationSettings) {
                        setAutoCompetitors(data.automationSettings.competitors || []);
                        setAutoWritingStyle(data.automationSettings.writingStyle || "let ai decide");
                        setAutoScriptLanguage(data.automationSettings.scriptLanguage || "English");
                        setAutoCaptionLanguage(data.automationSettings.captionLanguage || "English");
                    }
                })
                .catch((e) => console.error("Failed to fetch profile:", e));
        }
    }, [session]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (phoneDropdownRef.current && !phoneDropdownRef.current.contains(e.target as Node))
                setShowPhoneCodeDropdown(false);
        };
        if (showPhoneCodeDropdown) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showPhoneCodeDropdown]);

    useEffect(() => {
        fetch("/api/subscription/current")
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (data?.hasSubscription)
                    setCurrentSubscription({
                        id: data.subscription.id,
                        status: data.subscription.status,
                        currentPeriodEnd: data.subscription.currentPeriodEnd,
                        plan: data.plan,
                    });
            })
            .catch(console.error);
    }, []);

    const availableSubNiches = niche ? SUB_NICHE_MAPPING[niche] || [] : [];
    const isPlatinum = currentSubscription?.plan?.name?.toLowerCase().includes("platinum");

    const handleSave = async () => {
        setIsSaving(true);
        setSaveError(null);
        try {
            const res = await fetch("/api/user/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName, lastName, phoneNumber, niche, subNiche, instagramUsername,
                    automationSettings: {
                        competitors: autoCompetitors,
                        writingStyle: autoWritingStyle,
                        scriptLanguage: autoScriptLanguage,
                        captionLanguage: autoCaptionLanguage,
                    },
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update");
            }
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            setSaveError((err as Error).message);
        } finally {
            setIsSaving(false);
        }
    };

    const selectedPhoneCode = countryCodes.find((c) => c.code === phoneCode);

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
        <div className="min-h-screen relative selection:bg-orange-200" style={{ background: "var(--bg-gradient)" }}>
            <Sidebar />

            {/* ── Mobile top nav ──────────────────────────────────────────────── */}
            <header className="md:hidden fixed top-0 inset-x-0 z-40 h-14 glass-panel rounded-none border-t-0 border-x-0 flex items-center px-4 gap-3">
                <Link
                    href="/dashboard"
                    className="w-9 h-9 flex items-center justify-center rounded-xl glass-inset text-theme-secondary hover:text-theme-primary transition-colors"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div className="flex items-center gap-2 flex-1">
                    <Image src="/T_logo.png" alt="Trendsta" width={24} height={24} className="object-contain" />
                    <span className="text-base font-bold text-theme-primary tracking-tight">Account Settings</span>
                </div>
                <div className="w-8 h-8 flex items-center justify-center rounded-lg glass-inset text-orange-500">
                    <Settings size={16} />
                </div>
            </header>

            {/* ── Main content ───────────────────────────────────────────────── */}
            <main className={`transition-all duration-300 ${isCollapsed ? "md:ml-20" : "md:ml-64"} min-h-screen pt-14 md:pt-0`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">

                    {/* Page header */}
                    <div className="mb-6 md:mb-8">
                        <div className="hidden md:flex items-center gap-2 text-sm mb-2 text-theme-secondary">
                            <ChevronDown className="w-4 h-4 rotate-90" />
                            <span className="uppercase tracking-wider font-bold">Settings</span>
                        </div>
                        <h1 className="hidden md:block text-4xl md:text-5xl font-mono tracking-[-0.05em] uppercase font-bold text-theme-primary">
                            Account Settings
                        </h1>
                        <p className="text-sm text-theme-secondary mt-1 md:mt-2 font-medium">
                            Manage your preferences, security, and connected tools.
                        </p>
                    </div>

                    <div className="space-y-5">

                        {/* ── Personal Information ───────────────────────────────── */}
                        <div className="glass-panel overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/10">
                                <h2 className="text-base font-semibold text-theme-primary">Personal Information</h2>
                                <p className="text-sm text-theme-secondary">Edit your personal information</p>
                            </div>
                            <div className="p-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>First name <span className="text-red-500">*</span></label>
                                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter first name" />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Last name <span className="text-red-500">*</span></label>
                                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter last name" />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Email <span className="text-red-500">*</span></label>
                                        <input type="email" value={email} disabled placeholder="example@email.com" className="opacity-50 cursor-not-allowed" />
                                        <p className="text-xs text-theme-muted mt-1">Email cannot be changed</p>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Phone number</label>
                                        <div className="flex gap-2">
                                            <div className="relative" ref={phoneDropdownRef}>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPhoneCodeDropdown(!showPhoneCodeDropdown)}
                                                    className="flex items-center gap-1.5 px-3 py-3 rounded-xl border glass-inset min-w-[88px] transition-colors"
                                                    style={{ borderColor: "var(--glass-border)" }}
                                                >
                                                    <span className="text-lg">{selectedPhoneCode?.flag}</span>
                                                    <span className="text-sm text-theme-secondary font-medium">{phoneCode}</span>
                                                    <ChevronDown size={13} className="text-theme-muted" />
                                                </button>
                                                {showPhoneCodeDropdown && (
                                                    <div className="absolute top-full left-0 mt-1 w-40 glass-panel z-50 max-h-48 overflow-y-auto !rounded-xl">
                                                        {countryCodes.map((country) => (
                                                            <button
                                                                key={country.country}
                                                                onClick={() => { setPhoneCode(country.code); setShowPhoneCodeDropdown(false); }}
                                                                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:opacity-80 transition-opacity"
                                                            >
                                                                <span className="text-lg">{country.flag}</span>
                                                                <span className="text-sm text-theme-primary font-medium">{country.code}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="000 000-0000" className="flex-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Instagram & Content ────────────────────────────────── */}
                        <div className="glass-panel overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundImage: "linear-gradient(135deg,rgba(244,63,94,0.15) 0%,rgba(139,92,246,0.15) 100%)" }}>
                                        <Zap className="w-4 h-4 text-pink-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-theme-primary">Instagram &amp; Content</h2>
                                        <p className="text-sm text-theme-secondary">Configure your content analysis settings</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <label className={labelCls}>Instagram Username <span className="text-red-500">*</span></label>
                                    <input type="text" value={instagramUsername} readOnly disabled placeholder="@yourusername" className="opacity-50 cursor-not-allowed" />
                                    <p className="text-xs text-theme-muted mt-1">Username cannot be changed</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>Content Niche <span className="text-red-500">*</span></label>
                                        <select value={niche} onChange={(e) => { setNiche(e.target.value); setSubNiche(""); }} style={selectBg}>
                                            <option value="">Select your niche</option>
                                            {NICHE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Sub-Niche <span className="text-red-500">*</span></label>
                                        <select value={subNiche} onChange={(e) => setSubNiche(e.target.value)} disabled={!niche} style={selectBg} className="disabled:opacity-50 disabled:cursor-not-allowed">
                                            <option value="">{niche ? "Select your specialization" : "First select a niche"}</option>
                                            {availableSubNiches.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Automation Settings ────────────────────────────────── */}
                        <div className="glass-panel overflow-hidden relative">
                            {!isPlatinum && (
                                <div className="absolute inset-0 z-20 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 rounded-2xl" style={{ background: "var(--glass-surface)" }}>
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-xl" style={{ background: "var(--text-primary)" }}>
                                        <Lock className="w-6 h-6" style={{ color: "var(--bg-primary)" }} />
                                    </div>
                                    <h3 className="text-base font-bold text-theme-primary mb-1">Platinum Feature</h3>
                                    <p className="text-sm text-theme-secondary max-w-xs mb-4">Upgrade to Platinum to unlock automated analysis defaults and save time.</p>
                                    <button onClick={() => router.push("/subscription")} className="px-5 py-2 text-sm font-semibold rounded-xl transition-colors" style={{ background: "var(--text-primary)", color: "var(--bg-primary)" }}>
                                        Upgrade Now
                                    </button>
                                </div>
                            )}

                            <div className="px-5 py-4 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundImage: "linear-gradient(135deg,rgba(59,130,246,0.15) 0%,rgba(147,51,234,0.15) 100%)" }}>
                                        <Zap className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-theme-primary">Automation Settings</h2>
                                        <p className="text-sm text-theme-secondary">Configure defaults for automated analysis</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 space-y-5">
                                <div>
                                    <label className={labelCls}>Default Competitor List</label>
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            placeholder="Enter username (e.g. 100xengineers)"
                                            value={autoNewCompetitor}
                                            onChange={(e) => setAutoNewCompetitor(e.target.value)}
                                            disabled={!isPlatinum}
                                            className="flex-1 disabled:opacity-50"
                                        />
                                        <button
                                            onClick={() => {
                                                if (autoNewCompetitor.trim() && !autoCompetitors.includes(autoNewCompetitor.trim())) {
                                                    setAutoCompetitors([...autoCompetitors, autoNewCompetitor.trim()]);
                                                    setAutoNewCompetitor("");
                                                }
                                            }}
                                            disabled={!isPlatinum}
                                            className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 shrink-0"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                    {autoCompetitors.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {autoCompetitors.map((comp) => (
                                                <span key={comp} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg glass-inset text-theme-primary">
                                                    @{comp}
                                                    <button onClick={() => setAutoCompetitors(autoCompetitors.filter((c) => c !== comp))} disabled={!isPlatinum} className="hover:text-red-500 transition-colors">
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-theme-muted italic">No default competitors added.</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className={`${labelCls} flex items-center gap-1.5`}><PenTool size={13} className="text-theme-muted" />Writing Style</label>
                                        <input type="text" value={autoWritingStyle} onChange={(e) => setAutoWritingStyle(e.target.value)} disabled={!isPlatinum} placeholder="let ai decide" className="disabled:opacity-50" />
                                    </div>
                                    <div>
                                        <label className={`${labelCls} flex items-center gap-1.5`}><Languages size={13} className="text-theme-muted" />Script Language</label>
                                        <select value={autoScriptLanguage} onChange={(e) => setAutoScriptLanguage(e.target.value)} disabled={!isPlatinum} style={selectBg} className="disabled:opacity-50 disabled:cursor-not-allowed">
                                            {["English", "Hindi", "Spanish", "French", "German"].map((l) => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={`${labelCls} flex items-center gap-1.5`}><Languages size={13} className="text-theme-muted" />Caption Language</label>
                                        <select value={autoCaptionLanguage} onChange={(e) => setAutoCaptionLanguage(e.target.value)} disabled={!isPlatinum} style={selectBg} className="disabled:opacity-50 disabled:cursor-not-allowed">
                                            {["English", "Hindi", "Spanish", "French", "German"].map((l) => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Save row ───────────────────────────────────────────── */}
                        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pb-6">
                            {saveError && <span className="text-sm text-red-500 font-medium">{saveError}</span>}
                            {saveSuccess && (
                                <span className="text-sm text-emerald-500 font-medium flex items-center gap-1">
                                    <Check size={16} /> Changes saved successfully
                                </span>
                            )}
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                {isSaving ? (
                                    <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />Saving...</>
                                ) : (
                                    <><Save size={18} />Save Changes</>
                                )}
                            </button>
                        </div>

                        {/* ── Danger Zone (Logout) ─────────────────────────────────── */}
                        {!isGuest && (
                            <div className="glass-panel overflow-hidden border border-red-500/20 mt-8 mb-8">
                                <div className="flex flex-col sm:flex-row items-center justify-between p-5 gap-4">
                                    <div>
                                        <h2 className="text-base font-semibold text-theme-primary">Account Session</h2>
                                        <p className="text-sm text-theme-secondary">Log out of your current session on this device.</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 rounded-xl font-semibold hover:bg-red-500 hover:text-white transition-colors shadow-sm shrink-0"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
}
