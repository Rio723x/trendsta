"use client";

import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SidebarContext";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { ChevronDown, Check, Save, Zap, Lock, Plus, X, Languages, PenTool } from "lucide-react";

import {
    NICHE_OPTIONS,
    SUB_NICHE_MAPPING,

} from "../onboarding/onboardingData";


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


interface Plan {
    id: string;
    name: string;
    tier: number;
    price: number;
    currency: string;
    providerProductId: string;
    monthlyStellasGrant: number;
}

// Country codes for phone
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


export default function AccountPage() {
    // STATIC: Removed useSession for debugging -> Restored for checkout
    const { isCollapsed } = useSidebar();
    const router = useRouter();
    const { data: session } = useSession();



    // Form state - using static placeholder values
    const [firstName, setFirstName] = useState("John");
    const [lastName, setLastName] = useState("Doe");
    const [email, setEmail] = useState("john.doe@example.com");
    const [phoneCode, setPhoneCode] = useState("+1");
    const [phoneNumber, setPhoneNumber] = useState("555-0123");
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Effect to pre-fill user data from session and DB
    React.useEffect(() => {
        if (session?.user) {
            if (!firstName || firstName === "John") setFirstName(session.user.name?.split(' ')[0] || "");
            if (!lastName || lastName === "Doe") setLastName(session.user.name?.split(' ').slice(1).join(' ') || "");
            setEmail(session.user.email || "");

            // Fetch onboarding data
            fetch('/api/user/profile')
                .then(res => res.json())
                .then(data => {
                    if (data.niche) setNiche(data.niche);
                    if (data.subNiche) setSubNiche(data.subNiche);
                    if (data.instagramUsername) setInstagramUsername(data.instagramUsername);

                    // Set automation settings if available
                    if (data.automationSettings) {
                        setAutoCompetitors(data.automationSettings.competitors || []);
                        setAutoWritingStyle(data.automationSettings.writingStyle || "let ai decide");
                        setAutoScriptLanguage(data.automationSettings.scriptLanguage || "English");
                        setAutoCaptionLanguage(data.automationSettings.captionLanguage || "English");
                    }
                })
                .catch(err => console.error('Failed to fetch profile:', err));
        }
    }, [session]);

    const [saveError, setSaveError] = useState<string | null>(null);

    // Instagram & Onboarding fields
    const [instagramUsername, setInstagramUsername] = useState("");
    const [niche, setNiche] = useState("");
    const [subNiche, setSubNiche] = useState("");

    // Automation Settings
    const [autoCompetitors, setAutoCompetitors] = useState<string[]>([]);
    const [autoNewCompetitor, setAutoNewCompetitor] = useState("");
    const [autoWritingStyle, setAutoWritingStyle] = useState("let ai decide");
    const [autoScriptLanguage, setAutoScriptLanguage] = useState("English");
    const [autoCaptionLanguage, setAutoCaptionLanguage] = useState("English");

    // Subscription State
    const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);

    // Dropdown states
    const [showPhoneCodeDropdown, setShowPhoneCodeDropdown] = useState(false);
    const phoneDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (phoneDropdownRef.current && !phoneDropdownRef.current.contains(event.target as Node)) {
                setShowPhoneCodeDropdown(false);
            }
        }

        if (showPhoneCodeDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showPhoneCodeDropdown]);

    // Get available sub-niches based on selected niche
    const availableSubNiches = niche ? SUB_NICHE_MAPPING[niche] || [] : [];

    // Fetch Subscription only (for feature gating)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch current subscription
                try {
                    const subRes = await fetch("/api/subscription/current");
                    if (!subRes.ok) throw new Error(`Subscription fetch failed: ${subRes.status}`);
                    const subData = await subRes.json();

                    if (subData.hasSubscription) {
                        setCurrentSubscription({
                            id: subData.subscription.id,
                            status: subData.subscription.status,
                            currentPeriodEnd: subData.subscription.currentPeriodEnd,
                            plan: subData.plan
                        });
                    }
                } catch (e) {
                    console.error("Error fetching subscription:", e);
                }
            } catch (err) {
                console.error("Unexpected error in fetchData:", err);
            }
        };

        fetchData();
    }, []);

    const handleNicheChange = (value: string) => {
        setNiche(value);
        setSubNiche(""); // Reset sub-niche when niche changes
    };

    const handleInstagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        // Auto-add @ if not present
        if (val && !val.startsWith("@")) {
            val = "@" + val;
        }
        setInstagramUsername(val);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveError(null);

        try {
            const response = await fetch("/api/user/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    phoneNumber,
                    niche,
                    subNiche,
                    instagramUsername,
                    automationSettings: {
                        competitors: autoCompetitors,
                        writingStyle: autoWritingStyle,
                        scriptLanguage: autoScriptLanguage,
                        captionLanguage: autoCaptionLanguage,
                    },
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update");
            }

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error(err);
            setSaveError((err as Error).message);
        } finally {
            setIsSaving(false);
        }
    };

    const selectedPhoneCode = countryCodes.find((c) => c.code === phoneCode);

    return (
        <div className="min-h-screen relative selection:bg-orange-200 bg-[#fafafa]">
            <Sidebar />

            <main
                className={`transition-all duration-300 ${isCollapsed ? "md:ml-20" : "md:ml-64"
                    } min-h-screen`}
            >
                <div className="max-w-4xl mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-sm mb-2 text-gray-500">
                            <ChevronDown className="w-4 h-4 rotate-90" />
                            <span className="uppercase tracking-wider font-bold">Settings</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-mono tracking-[-0.05em] uppercase font-bold text-gray-900">Account Settings</h1>
                        <p className="text-sm text-gray-500 mt-2 font-medium">
                            Manage your preferences, security, and connected tools all in one place.
                        </p>
                    </div>


                    {/* Content */}

                    <div className="space-y-6 animate-fadeIn">
                        {/* Personal Information Card */}
                        <div className="glass-panel overflow-hidden">
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-lg font-semibold text-theme-primary">Personal Information</h2>
                                <p className="text-sm text-theme-secondary">Edit your personal information</p>
                            </div>

                            <div className="p-6">
                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* First Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-theme-primary mb-2">
                                            First name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="Enter first name"
                                            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/20 text-theme-primary transition-all font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-theme-primary mb-2">
                                            Last name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Enter last name"
                                            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/20 text-theme-primary transition-all font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-theme-primary mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="example@email.com"
                                            disabled
                                            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/5 text-theme-secondary transition-all font-medium focus:outline-none cursor-not-allowed"
                                        />
                                        <p className="text-xs text-theme-muted mt-1">Email cannot be changed</p>
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-theme-primary mb-2">
                                            Phone number
                                        </label>
                                        <div className="flex gap-2">
                                            {/* Country Code Dropdown */}
                                            <div className="relative" ref={phoneDropdownRef}>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPhoneCodeDropdown(!showPhoneCodeDropdown)}
                                                    className="flex items-center gap-2 px-3 py-3 rounded-xl border border-white/10 bg-black/20 transition-colors bg-glass-inset-bg min-w-[90px]"
                                                >
                                                    <span className="text-lg">{selectedPhoneCode?.flag}</span>
                                                    <span className="text-sm text-theme-secondary font-medium">{phoneCode}</span>
                                                    <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
                                                </button>
                                                {showPhoneCodeDropdown && (
                                                    <div className="absolute top-full left-0 mt-1 w-40 border border-white/10 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto glass-panel"
                                                    >
                                                        {countryCodes.map((country) => (
                                                            <button
                                                                key={country.country}
                                                                onClick={() => {
                                                                    setPhoneCode(country.code);
                                                                    setShowPhoneCodeDropdown(false);
                                                                }}
                                                                className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors hover:opacity-80"
                                                                style={{ backgroundColor: 'var(--glass-surface)' }}
                                                            >
                                                                <span className="text-lg">{country.flag}</span>
                                                                <span className="text-sm text-theme-primary font-medium">{country.code}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="tel"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                placeholder="000 000-000 00"
                                                className="flex-1 px-4 py-3 rounded-xl border border-white/10 bg-black/20 text-theme-primary transition-all font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel overflow-hidden">
                            <div className="p-6 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)' }}>
                                        <Zap className="w-5 h-5 text-pink-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-theme-primary">Instagram & Content</h2>
                                        <p className="text-sm text-theme-primary">Configure your content analysis settings</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Instagram Username */}
                                <div>
                                    <label className="block text-sm font-medium text-theme-primary mb-2">
                                        Instagram Username <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={instagramUsername}
                                        readOnly
                                        disabled
                                        placeholder="@yourusername"
                                        className="w-full px-4 py-3 rounded-xl border transition-all font-medium focus:outline-none cursor-not-allowed"
                                        style={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.03)',
                                        }}
                                    />
                                    <p className="text-xs text-theme-muted mt-1">Username cannot be changed</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Niche */}
                                    <div>
                                        <label className="block text-sm font-medium text-theme-primary mb-2">
                                            Content Niche <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={niche}
                                            onChange={(e) => {
                                                setNiche(e.target.value);
                                                setSubNiche(""); // Reset sub-niche when niche changes
                                            }}
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 1rem center',
                                                backgroundSize: '1.25rem',
                                            } as any}
                                            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/20 text-theme-primary transition-all font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        >
                                            <option value="">Select your niche</option>
                                            {NICHE_OPTIONS.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Sub-Niche */}
                                    <div>
                                        <label className="block text-sm font-medium text-theme-primary mb-2">
                                            Sub-Niche <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={subNiche}
                                            onChange={(e) => setSubNiche(e.target.value)}
                                            disabled={!niche}
                                            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/20 text-theme-primary transition-all font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 1rem center',
                                                backgroundSize: '1.25rem',
                                            } as any}
                                        >
                                            <option value="">
                                                {niche ? "Select your specialization" : "First select a niche"}
                                            </option>
                                            {availableSubNiches.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl overflow-hidden relative" style={{ backgroundColor: 'var(--glass-surface)', border: '1px solid var(--glass-border)' }}>
                            {(!currentSubscription?.plan?.name?.toLowerCase().includes('platinum')) && (
                                <div className="absolute inset-0 z-20 backdrop-blur-sm bg-white/50 flex flex-col items-center justify-center text-center p-6">
                                    <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-3 shadow-xl">
                                        <Lock className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Platinum Feature</h3>
                                    <p className="text-sm text-slate-600 max-w-xs mb-4">
                                        Upgrade to Platinum to unlock automated analysis defaults and save time.
                                    </p>
                                    <button
                                        onClick={() => router.push('/subscription')}
                                        className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                                    >
                                        Upgrade Now
                                    </button>
                                </div>
                            )}

                            <div className="p-6" style={{ borderBottomColor: 'var(--glass-border)', borderBottomWidth: '1px' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)' }}>
                                        <Zap className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-theme-primary">Automation Settings</h2>
                                        <p className="text-sm text-theme-primary">Configure defaults for automated analysis</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Competitors List */}
                                <div>
                                    <label className="block text-sm font-medium text-theme-primary mb-2">
                                        Default Competitor List
                                    </label>
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            placeholder="Enter username (e.g. 100xengineers)"
                                            value={autoNewCompetitor}
                                            onChange={(e) => setAutoNewCompetitor(e.target.value)}
                                            disabled={!currentSubscription?.plan?.name?.toLowerCase().includes('platinum')}
                                            className="flex-1 px-4 py-3 rounded-xl border transition-all font-medium focus:outline-none focus:ring-2 disabled:opacity-50"
                                            style={{
                                                backgroundColor: 'var(--glass-inset-bg)',
                                                color: 'var(--text-primary)',
                                                borderColor: 'var(--glass-border)',
                                            } as any}
                                        />
                                        <button
                                            onClick={() => {
                                                if (autoNewCompetitor.trim() && !autoCompetitors.includes(autoNewCompetitor.trim())) {
                                                    setAutoCompetitors([...autoCompetitors, autoNewCompetitor.trim()]);
                                                    setAutoNewCompetitor("");
                                                }
                                            }}
                                            disabled={!currentSubscription?.plan?.name?.toLowerCase().includes('platinum')}
                                            className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>

                                    {autoCompetitors.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {autoCompetitors.map((comp) => (
                                                <span key={comp} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-100">
                                                    @{comp}
                                                    <button
                                                        onClick={() => setAutoCompetitors(autoCompetitors.filter(c => c !== comp))}
                                                        disabled={!currentSubscription?.plan?.name?.toLowerCase().includes('platinum')}
                                                        className="hover:text-blue-900"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-theme-muted italic">No default competitors added.</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Writing Style */}
                                    <div>
                                        <label className="block text-sm font-medium text-theme-primary mb-2 flex items-center gap-2">
                                            <PenTool size={14} className="text-theme-secondary" />
                                            Writing Style
                                        </label>
                                        <input
                                            type="text"
                                            value={autoWritingStyle}
                                            onChange={(e) => setAutoWritingStyle(e.target.value)}
                                            disabled={!currentSubscription?.plan?.name?.toLowerCase().includes('platinum')}
                                            placeholder="let ai decide"
                                            className="w-full px-4 py-3 rounded-xl border transition-all font-medium focus:outline-none focus:ring-2 disabled:opacity-50"
                                            style={{
                                                backgroundColor: 'var(--glass-inset-bg)',
                                                color: 'var(--text-primary)',
                                                borderColor: 'var(--glass-border)',
                                            } as any}
                                        />
                                    </div>

                                    {/* Script Language */}
                                    <div>
                                        <label className="block text-sm font-medium text-theme-primary mb-2 flex items-center gap-2">
                                            <Languages size={14} className="text-theme-secondary" />
                                            Script Language
                                        </label>
                                        <select
                                            value={autoScriptLanguage}
                                            onChange={(e) => setAutoScriptLanguage(e.target.value)}
                                            disabled={!currentSubscription?.plan?.name?.toLowerCase().includes('platinum')}
                                            className="w-full px-4 py-3 rounded-xl border transition-all font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 disabled:opacity-50"
                                            style={{
                                                backgroundColor: 'var(--glass-inset-bg)',
                                                color: 'var(--text-primary)',
                                                borderColor: 'var(--glass-border)',
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 1rem center',
                                                backgroundSize: '1.25rem',
                                            } as any}
                                        >
                                            <option value="English">English</option>
                                            <option value="Hindi">Hindi</option>
                                            <option value="Spanish">Spanish</option>
                                            <option value="French">French</option>
                                            <option value="German">German</option>
                                        </select>
                                    </div>

                                    {/* Caption Language */}
                                    <div>
                                        <label className="block text-sm font-medium text-theme-primary mb-2 flex items-center gap-2">
                                            <Languages size={14} className="text-theme-secondary" />
                                            Caption Language
                                        </label>
                                        <select
                                            value={autoCaptionLanguage}
                                            onChange={(e) => setAutoCaptionLanguage(e.target.value)}
                                            disabled={!currentSubscription?.plan?.name?.toLowerCase().includes('platinum')}
                                            className="w-full px-4 py-3 rounded-xl border transition-all font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 disabled:opacity-50"
                                            style={{
                                                backgroundColor: 'var(--glass-inset-bg)',
                                                color: 'var(--text-primary)',
                                                borderColor: 'var(--glass-border)',
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 1rem center',
                                                backgroundSize: '1.25rem',
                                            } as any}
                                        >
                                            <option value="English">English</option>
                                            <option value="Hindi">Hindi</option>
                                            <option value="Spanish">Spanish</option>
                                            <option value="French">French</option>
                                            <option value="German">German</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex items-center justify-end gap-4">
                            {saveError && (
                                <span className="text-sm text-red-600 font-medium">
                                    {saveError}
                                </span>
                            )}
                            {saveSuccess && (
                                <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                                    <Check size={16} />
                                    Changes saved successfully
                                </span>
                            )}
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div >
            </main >
        </div >
    );
}
