"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Zap, Check, ChevronDown, CreditCard, Star, Sparkles } from "lucide-react";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import { useSidebar } from "../context/SidebarContext";
import { STELLA_BUNDLES } from "@/lib/constants/products";

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


export default function SubscriptionPage() {
    const router = useRouter();
    const { isCollapsed } = useSidebar();
    const { data: session } = useSession();

    const [plans, setPlans] = useState<Plan[]>([]);
    const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
    const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
    const [previewData, setPreviewData] = useState<PreviewData | null>(null);
    const [isProcessingAction, setIsProcessingAction] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const [walletBalance, setWalletBalance] = useState({ monthlyBalance: 0, topupBalance: 0, totalBalance: 0 });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingSubscription(true);
            try {
                // Fetch plans
                let plansData = { plans: [] };
                try {
                    const plansRes = await fetch("/api/subscription/plans");
                    if (!plansRes.ok) throw new Error(`Plans fetch failed: ${plansRes.status}`);
                    plansData = await plansRes.json();
                    if (plansData.plans) setPlans(plansData.plans);
                } catch (e) {
                    console.error("Error fetching plans:", e);
                }

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

                // Fetch wallet balance
                try {
                    const walletRes = await fetch("/api/wallet");
                    if (!walletRes.ok) throw new Error(`Wallet fetch failed: ${walletRes.status}`);
                    const walletData = await walletRes.json();
                    if (walletData.totalBalance !== undefined) {
                        setWalletBalance(walletData);
                    }
                } catch (e) {
                    console.error("Error fetching wallet:", e);
                }
            } catch (err) {
                console.error("Unexpected error in fetchData:", err);
            } finally {
                setIsLoadingSubscription(false);
            }
        };

        fetchData();
    }, []);




    const handleBundlePurchase = async (bundle: { id: string, name: string, price: number }) => {
        if (!session) {
            router.push("/signin");
            return;
        }
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
                    productId: bundle.id,
                    email: session.user.email,
                    name: session.user.name,
                    metadata: {
                        userId: session.user.id,
                        source: "subscription_page_bundle_purchase",
                        bundleName: bundle.name
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
    };

    const handlePlanAction = async (targetPlan: Plan) => {
        if (!session) {
            router.push("/signin");
            return;
        }
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
                        name: session.user.name, // Use session name directly
                        metadata: {
                            userId: session.user.id,
                            source: "subscription_page_plan_selection"
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

    return (
        <div className="min-h-screen relative selection:bg-blue-200">
            <Sidebar />
            <MobileHeader />

            <main
                className={`transition-all duration-300 ${isCollapsed ? "md:ml-20" : "md:ml-64"
                    } min-h-screen`}
            >
                <div className="max-w-6xl mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                            <CreditCard className="w-4 h-4" />
                            <span>Membership</span>
                        </div>
                        <h1 className="text-3xl font-bold text-theme-primary">Subscription Plan</h1>
                        <p className="text-sm text-theme-secondary mt-1">
                            Upgrade your plan to unlock more features and AI capabilities.
                        </p>
                    </div>

                    <div className="space-y-6 animate-fadeIn">
                        {/* Stats Overview */}
                        <div className="glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-lg font-bold text-theme-primary">
                                        {currentSubscription ? currentSubscription.plan.name : "Free Plan"}
                                    </h2>
                                    {currentSubscription && (
                                        <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full uppercase tracking-wide">
                                            {currentSubscription.status}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-theme-secondary">
                                    {currentSubscription
                                        ? "Manage your active subscription"
                                        : "Upgrade to unlock full power"}
                                </p>
                            </div>

                            <div className="flex items-center gap-8 w-full md:w-auto">
                                <div className="flex-1 md:flex-none">
                                    <p className="text-xs text-slate-400 dark:text-slate-300 font-bold uppercase tracking-wider mb-1">Stella Balance</p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-2xl font-black text-purple-600">{walletBalance.totalBalance}</span>
                                        <span className="text-sm text-slate-400 font-medium mb-1">({walletBalance.monthlyBalance} monthly + {walletBalance.topupBalance} topup)</span>
                                    </div>
                                </div>
                                <div className="flex-1 md:flex-none text-right">
                                    <p className="text-xs text-theme-muted font-bold uppercase tracking-wider mb-1">Renewal</p>
                                    <p className="text-theme-primary font-semibold">
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
                                <div className="rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fadeIn border glass-panel">
                                    <h3 className="text-xl font-bold text-theme-primary mb-2">
                                        Confirm {previewData.changeType === 'upgrade' ? 'Upgrade' : 'Downgrade'}
                                    </h3>
                                    <p className="text-theme-secondary mb-6">
                                        You are about to switch to <span className="font-semibold text-theme-primary">{previewData.targetPlanName}</span>.
                                    </p>

                                    <div className="rounded-xl p-4 mb-6 space-y-3 bg-black/5">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-theme-secondary">New Price</span>
                                            <span className="font-semibold text-theme-primary">{previewData.currency} {(previewData.newPlanDetails.amount / 100).toFixed(2)}/{previewData.newPlanDetails.interval}</span>
                                        </div>
                                        {previewData.changeType === 'upgrade' && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-theme-secondary">Immediate Charge (Prorated)</span>
                                                <span className="font-bold text-emerald-600">
                                                    {previewData.currency} {(previewData.chargeAmount / 100).toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        {previewData.changeType === 'upgrade' && previewData.stellasToGrant > 0 && (
                                            <div className="pt-3 border-t border-white/10">
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
                                            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-theme-secondary font-semibold transition-colors"
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
                                let containerClass = "rounded-3xl p-6 flex flex-col border";
                                let containerStyle: any = {
                                    backgroundColor: 'var(--glass-surface)',
                                    borderColor: 'var(--glass-border)'
                                };
                                if (isGold) {
                                    containerStyle = {
                                        backgroundColor: 'var(--glass-surface)',
                                        borderColor: 'rgba(217, 119, 6, 0.3)'
                                    };
                                }
                                if (isPlatinum) {
                                    containerStyle = {
                                        backgroundColor: 'var(--glass-surface)',
                                        borderColor: 'rgba(147, 51, 234, 0.3)',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                                    };
                                }

                                const isCurrentPlan = currentSubscription?.plan.id === plan.id;
                                const isUpgrade = currentSubscription && plan.tier > currentSubscription.plan.tier;



                                // Base hover auras
                                let auraColor = "rgba(148, 163, 184, 0.4)"; // Silver
                                if (isGold) auraColor = "rgba(245, 158, 11, 0.3)";
                                if (isPlatinum) auraColor = "rgba(168, 85, 247, 0.4)";

                                return (
                                    <div key={plan.id} className={`${containerClass} group relative transition-all duration-500 hover:-translate-y-2`} style={containerStyle}>
                                        {/* Responsive Glass UI Aura */}
                                        <div
                                            className="absolute -inset-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-[inherit] pointer-events-none z-0 blur-xl"
                                            style={{
                                                background: `radial-gradient(circle at 50% 0%, ${auraColor}, transparent 70%)`,
                                            }}
                                        />
                                        {/* Platinum Glow & Badge */}
                                        {isPlatinum && (
                                            <>
                                                <div className="absolute top-0 right-0 p-4">
                                                    <span className="px-3 py-1 bg-purple-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wide shadow-lg shadow-purple-900/50">
                                                        Best Seller
                                                    </span>
                                                </div>
                                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/20 blur-3xl rounded-full pointer-events-none opacity-40"></div>
                                            </>
                                        )}

                                        <div className="mb-4 relative z-10">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${isPlatinum ? 'bg-purple-500/20 text-purple-400' :
                                                isGold ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-500' :
                                                    'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                                }`}>
                                                {isPlatinum ? <Zap size={20} fill="currentColor" /> :
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
                                            </div>
                                            <h3 className={`text-xl font-bold ${isPlatinum ? 'text-theme-primary' : 'text-theme-primary'}`}>{plan.name}</h3>
                                            <p className={`text-xs mt-1 ${isPlatinum ? 'text-theme-secondary' : 'text-theme-secondary'}`}>
                                                {isPlatinum ? 'Full AI power for agencies & pros.' :
                                                    isGold ? 'For serious competitors who need data.' :
                                                        'Essential tools for creators starting out.'}
                                            </p>
                                        </div>

                                        <div className="mb-6 relative z-10">
                                            <div className="flex items-baseline gap-1">
                                                <span className={`text-3xl font-bold ${isPlatinum ? 'text-theme-primary' : 'text-theme-primary'}`}>
                                                    ${plan.price / 100}
                                                </span>
                                                <span className={`text-sm ${isPlatinum ? 'text-theme-secondary' : 'text-theme-secondary'}`}>/mo</span>
                                            </div>
                                        </div>

                                        <div className={`${isPlatinum ? 'bg-purple-500/10 border-purple-500/20' : isGold ? 'bg-amber-500/5 dark:bg-amber-900/10 border-amber-500/20 dark:border-amber-900/30' : 'bg-slate-500/5 dark:bg-white/5 border-slate-200 dark:border-white/5'} rounded-xl p-3 mb-6 border relative z-10`}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className={`text-xs font-bold ${isPlatinum ? 'text-purple-600 dark:text-purple-200' : 'text-slate-700 dark:text-slate-300'}`}>Stella Balance</span>
                                                <span className={`text-xs font-bold ${isPlatinum ? 'text-purple-700 dark:text-purple-300' : isGold ? 'text-amber-600 dark:text-amber-500' : 'text-orange-500'}`}>
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
                                                        <li key={feature} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                                                            <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                    {[
                                                        "Competitor Analysis",
                                                        "AI Consultant"
                                                    ].map(feature => (
                                                        <li key={feature} className="flex items-start gap-2 text-xs text-slate-300 dark:text-slate-600 line-through decoration-slate-300 dark:decoration-slate-600">
                                                            <Check size={14} className="text-slate-200 dark:text-slate-700 shrink-0 mt-0.5" />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </>
                                            )}

                                            {isGold && (
                                                <>
                                                    <div className="mb-4 text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-wider">Everything in Silver, plus</div>
                                                    {[
                                                        "Competitor Deep-Dive Analysis",
                                                        "Priority Support"
                                                    ].map((feature, i) => (
                                                        <li key={i} className={`flex items-start gap-2 text-sm ${isPlatinum ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>
                                                            <Check size={16} className={`mt-0.5 shrink-0 ${isPlatinum ? 'text-purple-400' : isGold ? 'text-amber-500' : 'text-blue-500'}`} />
                                                            <span>{feature}</span>
                                                        </li>
                                                    ))}
                                                    {[
                                                        "AI Consultant"
                                                    ].map(feature => (
                                                        <li key={feature} className="flex items-start gap-2 text-xs text-slate-300 dark:text-slate-600 line-through decoration-slate-300 dark:decoration-slate-600">
                                                            <Check size={14} className="text-slate-200 dark:text-slate-700 shrink-0 mt-0.5" />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </>
                                            )}

                                            {isPlatinum && (
                                                <>
                                                    <div className="mb-4 text-[10px] font-bold text-theme-muted uppercase tracking-wider relative z-10">Everything in Gold, plus</div>
                                                    {[
                                                        "AI Consultant Access (2 Stellas/prompt)",
                                                        "Deep Research Mode",
                                                        "Scheduled Daily WhatsApp/Mail Updates",
                                                        "Early Access to Beta Features"
                                                    ].map(feature => (
                                                        <li key={feature} className="flex items-start gap-2 text-xs text-theme-secondary font-medium">
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
                                            className="w-full py-2.5 rounded-xl font-semibold transition-colors text-sm relative z-10"
                                            style={{
                                                background: isCurrentPlan
                                                    ? (isPlatinum ? 'rgba(168, 85, 247, 0.2)' : 'rgba(0, 0, 0, 0.06)')
                                                    : (isPlatinum
                                                        ? '#9333ea'
                                                        : (isGold
                                                            ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)'
                                                            : 'linear-gradient(135deg, #9ca3af 0%, #d1d5db 50%, #e5e7eb 100%)')),
                                                color: isCurrentPlan
                                                    ? (isPlatinum ? '#c084fc' : 'var(--text-muted)')
                                                    : (isPlatinum ? 'white' : (isGold ? '#78350f' : '#374151')),
                                                border: isCurrentPlan
                                                    ? (isPlatinum ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid var(--glass-border)')
                                                    : 'none',
                                                cursor: isCurrentPlan ? 'default' : 'pointer',
                                                boxShadow: isCurrentPlan
                                                    ? 'none'
                                                    : (isPlatinum ? '0 10px 15px -3px rgba(147, 51, 234, 0.3)' : (isGold ? '0 8px 16px rgba(217, 119, 6, 0.2)' : '0 8px 16px rgba(156, 163, 175, 0.2)')),
                                            }}
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

                    {/* Stella Bundles Section */}
                    <div className="mt-16 mb-12 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold text-theme-primary mb-2">Running Low on Stellas?</h2>
                            <p className="text-theme-secondary">
                                Top up your balance instantly. <span className="text-amber-500 font-medium">Bundles available for active subscribers only.</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {STELLA_BUNDLES.map((bundle) => {
                                const isBestValue = bundle.bestValue;
                                return (
                                    <div
                                        key={bundle.id}
                                        className={`relative rounded-3xl p-6 flex flex-col items-center text-center border transition-all duration-300 hover:scale-105 ${isBestValue
                                            ? 'bg-amber-50/50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)]'
                                            : 'bg-white dark:bg-white/5 border-white/10 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                                            }`}
                                    >
                                        {isBestValue && (
                                            <div className="absolute -top-3 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">
                                                Best Value
                                            </div>
                                        )}

                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${bundle.color === 'amber' ? 'bg-amber-500/20 text-amber-500' :
                                            bundle.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            <div className="font-bold text-lg">T</div>
                                        </div>

                                        <h3 className="text-lg font-bold text-theme-primary mb-1">{bundle.name}</h3>
                                        <p className="text-sm text-theme-secondary mb-6">{bundle.stellas} Stellas</p>

                                        <div className="text-2xl font-bold text-theme-primary mb-6">
                                            ${bundle.price / 100}
                                        </div>

                                        <button
                                            onClick={() => {
                                                if (!currentSubscription) {
                                                    setActionError("You must have an active subscription to purchase bundles.");
                                                    return;
                                                }
                                                // Use dedicated bundle purchase handler
                                                handleBundlePurchase(bundle);
                                            }}
                                            className={`w-full py-2.5 rounded-xl font-semibold transition-colors text-sm ${isBestValue
                                                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20'
                                                : 'bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-white'
                                                }`}
                                        >
                                            Buy Bundle
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Info Container */}
                    <div className="mt-16 rounded-3xl overflow-hidden relative border border-white/10 bg-[#0f1219]">
                        {/* Background Gradient */}
                        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 relative z-10">
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                                        <span className="font-bold text-white">T</span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-amber-500">
                                        Unleash the Power of Stellas
                                    </h2>
                                </div>
                                <p className="text-theme-secondary text-lg leading-relaxed mb-8">
                                    Trendsta isn't just a dashboard; it's an intelligent agent. Stellas are the
                                    specialized tokens that fuel our AI's most advanced capabilities.
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    {['Pay-as-you-go', 'Rollover Credits', 'No Expiration'].map((tag) => (
                                        <span key={tag} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-slate-300">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Consumption Rates</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Dashboard Refresh', cost: '5 Stellas' },
                                        { label: 'Competitor Scan', cost: '4-9 Stellas*' },
                                        { label: 'AI Consultant Query', cost: '2 Stellas (Plat. Only)', color: 'text-amber-500' },
                                        { label: 'Viral Script Gen', cost: '2 Stellas', color: 'text-amber-500' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                            <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                                {item.label}
                                            </span>
                                            <span className={`text-sm font-bold ${item.color || 'text-amber-500'}`}>
                                                {item.cost}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-500 mt-6 italic">
                                    * Research costs vary by plan (Silver: 4-7, Gold/Platinum: 6-9)
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}