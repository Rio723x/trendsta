"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SidebarContext";
import { Camera, Trash2, Globe, Clock, ChevronDown, Check, Save, Zap } from "lucide-react";
import Image from "next/image";

// Language options
const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
    { code: "ko", name: "Korean", flag: "🇰🇷" },
];

// Timezone options
const timezones = [
    { value: "UTC+00:00", label: "UTC +00:00 - London" },
    { value: "UTC+01:00", label: "UTC +01:00 - Paris, Berlin" },
    { value: "UTC+02:00", label: "UTC +02:00 - Cairo, Athens" },
    { value: "UTC+03:00", label: "UTC +03:00 - Moscow, Istanbul" },
    { value: "UTC+04:00", label: "UTC +04:00 - Dubai" },
    { value: "UTC+05:00", label: "UTC +05:00 - Karachi" },
    { value: "UTC+05:30", label: "UTC +05:30 - India (IST)" },
    { value: "UTC+06:00", label: "UTC +06:00 - Dhaka" },
    { value: "UTC+07:00", label: "UTC +07:00 - Bangkok, Jakarta" },
    { value: "UTC+08:00", label: "UTC +08:00 - Singapore, Hong Kong" },
    { value: "UTC+09:00", label: "UTC +09:00 - Tokyo, Seoul" },
    { value: "UTC+10:00", label: "UTC +10:00 - Sydney" },
    { value: "UTC+12:00", label: "UTC +12:00 - Auckland" },
    { value: "UTC-05:00", label: "UTC -05:00 - New York (EST)" },
    { value: "UTC-06:00", label: "UTC -06:00 - Chicago (CST)" },
    { value: "UTC-07:00", label: "UTC -07:00 - Denver (MST)" },
    { value: "UTC-08:00", label: "UTC -08:00 - Los Angeles (PST)" },
];

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
    const { data: session, isPending } = useSession();
    const { isCollapsed } = useSidebar();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Tab state
    const [activeTab, setActiveTab] = useState<'profile' | 'plan'>('profile');

    // Form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneCode, setPhoneCode] = useState("+1");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [language, setLanguage] = useState("en");
    const [timezone, setTimezone] = useState("UTC+00:00");
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Dropdown states
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);
    const [showPhoneCodeDropdown, setShowPhoneCodeDropdown] = useState(false);

    // Pre-fill from session
    useEffect(() => {
        if (session?.user) {
            const nameParts = (session.user.name || "").split(" ");
            setFirstName(nameParts[0] || "");
            setLastName(nameParts.slice(1).join(" ") || "");
            setEmail(session.user.email || "");
            if (session.user.image) {
                setProfileImage(session.user.image);
            }
        }
    }, [session]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setProfileImage(null);
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const selectedLanguage = languages.find((l) => l.code === language);
    const selectedTimezone = timezones.find((t) => t.value === timezone);
    const selectedPhoneCode = countryCodes.find((c) => c.code === phoneCode);

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

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
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
                            <div className="p-6 border-b border-slate-100">
                                <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
                                <p className="text-sm text-slate-500">Edit your personal information</p>
                            </div>

                            <div className="p-6">
                                {/* Profile Picture */}
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-lg">
                                            {profileImage ? (
                                                <Image
                                                    src={profileImage}
                                                    alt="Profile"
                                                    width={96}
                                                    height={96}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <Camera size={32} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                                        >
                                            Upload An Image
                                        </button>
                                        {profileImage && (
                                            <button
                                                onClick={handleRemoveImage}
                                                className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>

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
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Phone number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-2">
                                            {/* Country Code Dropdown */}
                                            <div className="relative">
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

                                    {/* Language */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Language <span className="text-red-500">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Globe size={18} className="text-slate-400" />
                                                <span className="text-slate-900 font-medium">{selectedLanguage?.name}</span>
                                            </div>
                                            <ChevronDown size={18} className="text-slate-400" />
                                        </button>
                                        {showLanguageDropdown && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                                                {languages.map((lang) => (
                                                    <button
                                                        key={lang.code}
                                                        onClick={() => {
                                                            setLanguage(lang.code);
                                                            setShowLanguageDropdown(false);
                                                        }}
                                                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-lg">{lang.flag}</span>
                                                            <span className="text-sm text-slate-700 font-medium">{lang.name}</span>
                                                        </div>
                                                        {language === lang.code && (
                                                            <Check size={16} className="text-blue-600" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Timezone */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Time zone <span className="text-red-500">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
                                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Clock size={18} className="text-slate-400" />
                                                <span className="text-slate-900 text-sm truncate font-medium">
                                                    {selectedTimezone?.label}
                                                </span>
                                            </div>
                                            <ChevronDown size={18} className="text-slate-400 shrink-0" />
                                        </button>
                                        {showTimezoneDropdown && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                                                {timezones.map((tz) => (
                                                    <button
                                                        key={tz.value}
                                                        onClick={() => {
                                                            setTimezone(tz.value);
                                                            setShowTimezoneDropdown(false);
                                                        }}
                                                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50"
                                                    >
                                                        <span className="text-sm text-slate-700 font-medium">{tz.label}</span>
                                                        {timezone === tz.value && (
                                                            <Check size={16} className="text-blue-600" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="mt-8 flex items-center justify-end gap-4">
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
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fadeIn">
                            {/* Stats Overview */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-lg font-bold text-slate-900">Platinum Plan</h2>
                                        <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full uppercase tracking-wide">
                                            Active
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500">Full AI power for agencies & pros</p>
                                </div>
                                <div className="flex items-center gap-8 w-full md:w-auto">
                                    <div className="flex-1 md:flex-none">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Stella Balance</p>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-black text-purple-600">452</span>
                                            <span className="text-sm text-slate-400 font-medium mb-1">/ 520</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 md:flex-none text-right">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Renewal</p>
                                        <p className="text-slate-900 font-semibold">Feb 24, 2026</p>
                                    </div>
                                </div>
                            </div>

                            {/* Plans Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Silver */}
                                <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col">
                                    <div className="mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4 text-slate-600">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">Silver</h3>
                                        <p className="text-xs text-slate-500 mt-1">Essential tools for creators starting out.</p>
                                    </div>
                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold text-slate-900">$25</span>
                                            <span className="text-sm text-slate-500">/mo</span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-3 mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-slate-700">Stella Balance</span>
                                            <span className="text-xs font-bold text-orange-500">120</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
                                            <div className="bg-slate-400 h-full w-[30%]"></div>
                                        </div>
                                        <p className="text-[10px] text-slate-400 text-center">Research Cost: 4-7 Stellas</p>
                                    </div>

                                    <ul className="space-y-3 mb-8 flex-1">
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
                                    </ul>

                                    <button className="w-full py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-colors text-sm">
                                        Downgrade
                                    </button>
                                </div>

                                {/* Gold */}
                                <div className="bg-white rounded-3xl border border-amber-100 p-6 flex flex-col relative shadow-sm ring-1 ring-amber-100/50">
                                    <div className="mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4 text-amber-500">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 21c-.5 0-1-.2-1.4-.6-.4-.4-.6-1-.6-1.5 0-1.7 1.1-3 2.8-3.3 1.1-.2 2.2-.4 3.3-.6l1-.2c.2-.1.4-.1.6 0l.9 1.6c.1.2.3.4.6.4s.4-.1.6-.4l.9-1.6c.2-.2.5-.2.7 0l1 .2c1.1.2 2.2.4 3.3.6 1.7.3 2.8 1.6 2.8 3.3 0 .6-.2 1.1-.6 1.5-.4.4-.9.6-1.4.6H5zM12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6L12 2z" /></svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">Gold</h3>
                                        <p className="text-xs text-slate-500 mt-1">For serious competitors who need data.</p>
                                    </div>
                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold text-slate-900">$45</span>
                                            <span className="text-sm text-slate-500">/mo</span>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50/50 rounded-xl p-3 mb-6 border border-amber-100/50">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-slate-700">Stella Balance</span>
                                            <span className="text-xs font-bold text-amber-600">220</span>
                                        </div>
                                        <div className="w-full bg-amber-200/50 h-1.5 rounded-full overflow-hidden mb-2">
                                            <div className="bg-amber-500 h-full w-[50%]"></div>
                                        </div>
                                        <p className="text-[10px] text-amber-700/70 text-center">Enough for 15+ Competitor Scans</p>
                                    </div>

                                    <div className="mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Everything in Silver, plus</div>
                                    <ul className="space-y-3 mb-8 flex-1">
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
                                    </ul>

                                    <button className="w-full py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:border-amber-200 hover:text-amber-700 transition-colors text-sm">
                                        Downgrade
                                    </button>
                                </div>

                                {/* Platinum */}
                                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 flex flex-col relative shadow-xl overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4">
                                        <span className="px-3 py-1 bg-purple-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wide shadow-lg shadow-purple-900/50">
                                            Best Seller
                                        </span>
                                    </div>

                                    <div className="mb-4 relative z-10">
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                                            <Zap size={20} fill="currentColor" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Platinum</h3>
                                        <p className="text-xs text-slate-400 mt-1">Full AI power for agencies & pros.</p>
                                    </div>
                                    <div className="mb-6 relative z-10">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold text-white">$99</span>
                                            <span className="text-sm text-slate-400">/mo</span>
                                        </div>
                                    </div>

                                    <div className="bg-purple-500/10 rounded-xl p-3 mb-6 border border-purple-500/20 relative z-10">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-purple-200">Stella Balance</span>
                                            <span className="text-xs font-bold text-purple-300">520</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                                            <div className="bg-purple-500 h-full w-[80%] shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                                        </div>
                                        <p className="text-[10px] text-purple-300/70 text-center">Massive capacity for daily use</p>
                                    </div>

                                    <div className="mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider relative z-10">Everything in Gold, plus</div>
                                    <ul className="space-y-3 mb-8 flex-1 relative z-10">
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
                                    </ul>

                                    <button className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/20 text-sm relative z-10">
                                        Current Plan
                                    </button>

                                    {/* Gradient Glow */}
                                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>
                                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
