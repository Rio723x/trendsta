"use client";

import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SidebarContext";
import { useSession } from "@/lib/auth-client";
import { Camera, Trash2, ChevronDown, Check, Save, Zap, Instagram } from "lucide-react";

import {
    NICHE_OPTIONS,
    SUB_NICHE_MAPPING,

} from "../onboarding/onboardingData";

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

interface Plan {
    id: string;
    name: string;
    tier: number;
    price: number;
    currency: string;
    providerProductId: string;
    monthlyStellasGrant: number;
}

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

interface PreviewData {
    chargeAmount: number;
    currency: string;
    changeType: 'upgrade' | 'downgrade';
    newPlanDetails: any;
    targetProductId: string;
    targetPlanName: string;
    stellasToGrant: number;
}

export default function AccountPage() {
    // STATIC: Removed useSession for debugging -> Restored for checkout
    const { isCollapsed } = useSidebar();
    const { data: session } = useSession();

    // Tab state
    const [activeTab, setActiveTab] = useState<'profile' | 'plan'>('profile');

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
                })
                .catch(err => console.error('Failed to fetch profile:', err));
        }
    }, [session]);

    const [saveError, setSaveError] = useState<string | null>(null);

    // Instagram & Onboarding fields
    const [instagramUsername, setInstagramUsername] = useState("");
    const [niche, setNiche] = useState("");
    const [subNiche, setSubNiche] = useState("");

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

    // Subscription State
    const [plans, setPlans] = useState<Plan[]>([]);
    const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
    const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
    const [previewData, setPreviewData] = useState<PreviewData | null>(null);
    const [isProcessingAction, setIsProcessingAction] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    // Wallet State
    const [walletBalance, setWalletBalance] = useState({ monthlyBalance: 0, topupBalance: 0, totalBalance: 0 });

    // Get available sub-niches based on selected niche
    const availableSubNiches = niche ? SUB_NICHE_MAPPING[niche] || [] : [];

    // Fetch Subscription & Plans
    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoadingSubscription(true);
            try {
                // Fetch plans
                const plansRes = await fetch("/api/subscription/plans");
                const plansData = await plansRes.json();
                if (plansData.plans) setPlans(plansData.plans);

                // Fetch current subscription
                const subRes = await fetch("/api/subscription/current");
                const subData = await subRes.json();

                if (subData.hasSubscription) {
                    setCurrentSubscription({
                        id: subData.subscription.id,
                        status: subData.subscription.status,
                        currentPeriodEnd: subData.subscription.currentPeriodEnd,
                        plan: subData.plan
                    });
                }

                // Fetch wallet balance
                const walletRes = await fetch("/api/wallet");
                const walletData = await walletRes.json();
                if (walletData.totalBalance !== undefined) {
                    setWalletBalance(walletData);
                }
            } catch (err) {
                console.error("Failed to fetch subscription data", err);
            } finally {
                setIsLoadingSubscription(false);
            }
        };

        if (activeTab === 'plan') {
            fetchData();
        }
    }, [activeTab]);

    const handlePlanAction = async (targetPlan: Plan) => {
        if (!currentSubscription) {
            // Handle new subscription via Checkout
            setIsProcessingAction(true);
            setActionError(null);
            try {
                if (!session?.user?.email) {
                    throw new Error("User email not found. Please log in.");
                }

                const res = await fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        productId: targetPlan.providerProductId,
                        email: session.user.email,
                        name: session.user.name || `${firstName} ${lastName}`,
                        metadata: {
                            userId: session.user.id,
                            source: "account_page_plan_selection"
                        }
                    }),
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to initiate checkout");
                }

                const { checkout_url } = await res.json();
                if (checkout_url) {
                    window.location.href = checkout_url;
                } else {
                    throw new Error("No checkout URL returned");
                }
            } catch (err: any) {
                console.error("Checkout error:", err);
                setActionError(err.message || "Failed to start checkout");
                setIsProcessingAction(false);
            }
            return;
        }

        setActionError(null);
        setIsProcessingAction(true);

        try {
            const res = await fetch("/api/subscription/preview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetProductId: targetPlan.providerProductId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to preview plan change");
            }

            setPreviewData({
                ...data,
                targetProductId: targetPlan.providerProductId,
                targetPlanName: targetPlan.name
            });
        } catch (err: any) {
            setActionError(err.message);
        } finally {
            setIsProcessingAction(false);
        }
    };

    const confirmPlanChange = async () => {
        if (!previewData) return;

        setIsProcessingAction(true);
        setActionError(null);

        try {
            const res = await fetch("/api/subscription/change", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetProductId: previewData.targetProductId,
                    action: previewData.changeType
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to change plan");
            }

            // Refresh data
            setPreviewData(null);
            // Re-fetch subscription
            const subRes = await fetch("/api/subscription/current");
            const subData = await subRes.json();
            if (subData.hasSubscription) {
                setCurrentSubscription({
                    id: subData.subscription.id,
                    status: subData.subscription.status,
                    currentPeriodEnd: subData.subscription.currentPeriodEnd,
                    plan: subData.plan
                });
            }

        } catch (err: any) {
            setActionError(err.message);
        } finally {
            setIsProcessingAction(false);
        }
    };


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
        <div className="min-h-screen bg-slate-50">
            <Sidebar />

            <main
                className={`transition-all duration-300 ${isCollapsed ? "md:ml-20" : "md:ml-64"
                    } min-h-screen`}
            >
                <div className="max-w-4xl mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                            <ChevronDown className="w-4 h-4 rotate-90" />
                            <span>Settings</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
                        <p className="text-slate-500 mt-1">
                            Manage your preferences, security, and connected tools all in one place.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-1 mb-6 border-b border-slate-200">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${activeTab === 'profile'
                                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            My Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('plan')}
                            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${activeTab === 'plan'
                                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            Subscription Plan
                        </button>
                    </div>

                    {/* Content */}
                    {activeTab === 'profile' ? (
                        <div className="space-y-6 animate-fadeIn">
                            {/* Personal Information Card */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100">
                                    <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
                                    <p className="text-sm text-slate-500">Edit your personal information</p>
                                </div>

                                <div className="p-6">
                                    {/* Form Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* First Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                First name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                placeholder="Enter first name"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                                            />
                                        </div>

                                        {/* Last Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Last name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                placeholder="Enter last name"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="example@email.com"
                                                disabled
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 placeholder-slate-400 focus:outline-none transition-all font-medium cursor-not-allowed"
                                            />
                                            <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
                                        </div>

                                        {/* Phone Number */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Phone number
                                            </label>
                                            <div className="flex gap-2">
                                                {/* Country Code Dropdown */}
                                                <div className="relative" ref={phoneDropdownRef}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPhoneCodeDropdown(!showPhoneCodeDropdown)}
                                                        className="flex items-center gap-2 px-3 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors min-w-[90px]"
                                                    >
                                                        <span className="text-lg">{selectedPhoneCode?.flag}</span>
                                                        <span className="text-sm text-slate-600 font-medium">{phoneCode}</span>
                                                        <ChevronDown size={14} className="text-slate-400" />
                                                    </button>
                                                    {showPhoneCodeDropdown && (
                                                        <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                                                            {countryCodes.map((country) => (
                                                                <button
                                                                    key={country.country}
                                                                    onClick={() => {
                                                                        setPhoneCode(country.code);
                                                                        setShowPhoneCodeDropdown(false);
                                                                    }}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-left"
                                                                >
                                                                    <span className="text-lg">{country.flag}</span>
                                                                    <span className="text-sm text-slate-700 font-medium">{country.code}</span>
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
                                                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Instagram & Content Settings Card */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                                            <Instagram className="w-5 h-5 text-pink-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-slate-900">Instagram & Content</h2>
                                            <p className="text-sm text-slate-500">Configure your content analysis settings</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Instagram Username */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Instagram Username <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={instagramUsername}
                                            readOnly
                                            disabled
                                            placeholder="@yourusername"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 placeholder-slate-400 focus:outline-none transition-all font-medium cursor-not-allowed"
                                        />
                                        <p className="text-xs text-slate-400 mt-1">Username cannot be changed</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Niche */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Content Niche <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={niche}
                                                onChange={(e) => handleNicheChange(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium appearance-none cursor-pointer"
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'right 1rem center',
                                                    backgroundSize: '1.25rem',
                                                }}
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
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Sub-Niche <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={subNiche}
                                                onChange={(e) => setSubNiche(e.target.value)}
                                                disabled={!niche}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'right 1rem center',
                                                    backgroundSize: '1.25rem',
                                                }}
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
                    ) : (
                        <div className="space-y-6 animate-fadeIn">
                            {/* Stats Overview */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-lg font-bold text-slate-900">
                                            {currentSubscription ? currentSubscription.plan.name : "Free Plan"}
                                        </h2>
                                        {currentSubscription && (
                                            <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full uppercase tracking-wide">
                                                {currentSubscription.status}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        {currentSubscription
                                            ? "Manage your active subscription"
                                            : "Upgrade to unlock full power"}
                                    </p>
                                </div>

                                <div className="flex items-center gap-8 w-full md:w-auto">
                                    <div className="flex-1 md:flex-none">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Stella Balance</p>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-black text-purple-600">{walletBalance.totalBalance}</span>
                                            <span className="text-sm text-slate-400 font-medium mb-1">({walletBalance.monthlyBalance} monthly + {walletBalance.topupBalance} topup)</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 md:flex-none text-right">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Renewal</p>
                                        <p className="text-slate-900 font-semibold">
                                            {currentSubscription
                                                ? new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()
                                                : "-"
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Subscriptions Status Messages */}
                            {actionError && (
                                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
                                    {actionError}
                                </div>
                            )}

                            {/* Preview Modal */}
                            {previewData && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fadeIn">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                                            Confirm {previewData.changeType === 'upgrade' ? 'Upgrade' : 'Downgrade'}
                                        </h3>
                                        <p className="text-slate-500 mb-6">
                                            You are about to switch to <span className="font-semibold text-slate-900">{previewData.targetPlanName}</span>.
                                        </p>

                                        <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-3">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-600">New Price</span>
                                                <span className="font-semibold text-slate-900">{previewData.currency} {(previewData.newPlanDetails.amount / 100).toFixed(2)}/{previewData.newPlanDetails.interval}</span>
                                            </div>
                                            {previewData.changeType === 'upgrade' && (
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-600">Immediate Charge (Prorated)</span>
                                                    <span className="font-bold text-emerald-600">
                                                        {previewData.currency} {(previewData.chargeAmount / 100).toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                            {previewData.changeType === 'upgrade' && previewData.stellasToGrant > 0 && (
                                                <div className="pt-3 border-t border-slate-200">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-purple-600 font-medium">+ Bonus Stellas</span>
                                                        <span className="font-bold text-purple-600">{previewData.stellasToGrant}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    setPreviewData(null);
                                                    setActionError(null);
                                                }}
                                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={confirmPlanChange}
                                                disabled={isProcessingAction}
                                                className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                                            >
                                                {isProcessingAction ? "Processing..." : "Confirm Change"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Plans Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                                {isLoadingSubscription && (
                                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                                    </div>
                                )}

                                {/* Silver Map */}
                                {plans.map((plan) => {
                                    const isSilver = plan.name.toLowerCase().includes('silver');
                                    const isGold = plan.name.toLowerCase().includes('gold');
                                    const isPlatinum = plan.name.toLowerCase().includes('platinum');

                                    // Determine styles based on plan name
                                    let containerClass = "bg-white rounded-3xl border border-slate-200 p-6 flex flex-col";
                                    if (isGold) containerClass = "bg-white rounded-3xl border border-amber-100 p-6 flex flex-col relative shadow-sm ring-1 ring-amber-100/50";
                                    if (isPlatinum) containerClass = "bg-slate-900 rounded-3xl border border-slate-800 p-6 flex flex-col relative shadow-xl overflow-hidden group";

                                    const isCurrentPlan = currentSubscription?.plan.id === plan.id;
                                    const isUpgrade = currentSubscription && plan.tier > currentSubscription.plan.tier;



                                    return (
                                        <div key={plan.id} className={containerClass}>
                                            {/* Platinum Glow & Badge */}
                                            {isPlatinum && (
                                                <>
                                                    <div className="absolute top-0 right-0 p-4">
                                                        <span className="px-3 py-1 bg-purple-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wide shadow-lg shadow-purple-900/50">
                                                            Best Seller
                                                        </span>
                                                    </div>
                                                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>
                                                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
                                                </>
                                            )}

                                            <div className="mb-4 relative z-10">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${isPlatinum ? 'bg-purple-500/20 text-purple-400' :
                                                    isGold ? 'bg-amber-50 text-amber-500' :
                                                        'bg-slate-50 text-slate-600'
                                                    }`}>
                                                    {isPlatinum ? <Zap size={20} fill="currentColor" /> :
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
                                                </div>
                                                <h3 className={`text-xl font-bold ${isPlatinum ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                                                <p className={`text-xs mt-1 ${isPlatinum ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    {isPlatinum ? 'Full AI power for agencies & pros.' :
                                                        isGold ? 'For serious competitors who need data.' :
                                                            'Essential tools for creators starting out.'}
                                                </p>
                                            </div>

                                            <div className="mb-6 relative z-10">
                                                <div className="flex items-baseline gap-1">
                                                    <span className={`text-3xl font-bold ${isPlatinum ? 'text-white' : 'text-slate-900'}`}>
                                                        ${plan.price / 100}
                                                    </span>
                                                    <span className={`text-sm ${isPlatinum ? 'text-slate-400' : 'text-slate-500'}`}>/mo</span>
                                                </div>
                                            </div>

                                            <div className={`${isPlatinum ? 'bg-purple-500/10 border-purple-500/20' : isGold ? 'bg-amber-50/50 border-amber-100/50' : 'bg-slate-50 border-slate-100'} rounded-xl p-3 mb-6 border relative z-10`}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className={`text-xs font-bold ${isPlatinum ? 'text-purple-200' : 'text-slate-700'}`}>Stella Balance</span>
                                                    <span className={`text-xs font-bold ${isPlatinum ? 'text-purple-300' : isGold ? 'text-amber-600' : 'text-orange-500'}`}>
                                                        {plan.monthlyStellasGrant}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-200/20 h-1.5 rounded-full overflow-hidden mb-2">
                                                    <div className={`h-full ${isPlatinum ? 'bg-purple-500 w-[80%]' : isGold ? 'bg-amber-500 w-[50%]' : 'bg-slate-400 w-[30%]'}`}></div>
                                                </div>
                                            </div>

                                            <ul className="space-y-3 mb-8 flex-1 relative z-10">
                                                {isSilver && (
                                                    <>
                                                        {[
                                                            "Dashboard Access",
                                                            "Instagram Reels Insights",
                                                            "Viral Script Generator",
                                                            "Twitter Trends"
                                                        ].map(feature => (
                                                            <li key={feature} className="flex items-start gap-2 text-xs text-slate-600">
                                                                <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                                                {feature}
                                                            </li>
                                                        ))}
                                                        {[
                                                            "Competitor Analysis",
                                                            "AI Consultant"
                                                        ].map(feature => (
                                                            <li key={feature} className="flex items-start gap-2 text-xs text-slate-300 line-through decoration-slate-300">
                                                                <Check size={14} className="text-slate-200 shrink-0 mt-0.5" />
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </>
                                                )}

                                                {isGold && (
                                                    <>
                                                        <div className="mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Everything in Silver, plus</div>
                                                        {[
                                                            "Competitor Deep-Dive Analysis",
                                                            "Priority Support"
                                                        ].map(feature => (
                                                            <li key={feature} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                                                                <Check size={14} className="text-amber-500 shrink-0 mt-0.5" />
                                                                {feature}
                                                            </li>
                                                        ))}
                                                        {[
                                                            "AI Consultant"
                                                        ].map(feature => (
                                                            <li key={feature} className="flex items-start gap-2 text-xs text-slate-300 line-through decoration-slate-300">
                                                                <Check size={14} className="text-slate-200 shrink-0 mt-0.5" />
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </>
                                                )}

                                                {isPlatinum && (
                                                    <>
                                                        <div className="mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider relative z-10">Everything in Gold, plus</div>
                                                        {[
                                                            "AI Consultant Access (2 Stellas/prompt)",
                                                            "Deep Research Mode",
                                                            "Scheduled Daily WhatsApp/Mail Updates",
                                                            "Early Access to Beta Features"
                                                        ].map(feature => (
                                                            <li key={feature} className="flex items-start gap-2 text-xs text-slate-200 font-medium">
                                                                <div className="mt-0.5 rounded-full bg-purple-500/20 p-0.5">
                                                                    <Check size={10} className="text-purple-400 shrink-0" strokeWidth={3} />
                                                                </div>
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </>
                                                )}
                                            </ul>

                                            <button
                                                onClick={() => !isCurrentPlan && handlePlanAction(plan)}
                                                disabled={isCurrentPlan || isProcessingAction}
                                                className={`w-full py-2.5 rounded-xl font-semibold transition-colors text-sm relative z-10 ${isCurrentPlan
                                                    ? (isPlatinum ? 'bg-purple-900/50 text-purple-300 border border-purple-500/30' : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-default')
                                                    : (isPlatinum
                                                        ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-900/20'
                                                        : 'border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900')
                                                    }`}
                                            >
                                                {isProcessingAction && !isCurrentPlan ? 'Processing...' : (
                                                    isCurrentPlan ? 'Current Plan' : (currentSubscription ? (isUpgrade ? 'Upgrade' : 'Downgrade') : 'Subscribe')
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
