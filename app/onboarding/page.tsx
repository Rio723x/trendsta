'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import {
    NICHE_OPTIONS,
    SUB_NICHE_MAPPING,
    OnboardingFormData,
    INITIAL_FORM_DATA,
} from './onboardingData';

// ============================================================
// ONBOARDING QUESTIONNAIRE PAGE
// Premium SaaS / AI-consultancy experience
// ============================================================

const TOTAL_STEPS = 2;

// Animation variants for slide transitions
const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
    }),
};

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

export default function OnboardingPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { isProfileComplete, isLoading: profileLoading } = useProfileCompletion();

    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(0);
    const [formData, setFormData] = useState<OnboardingFormData>(INITIAL_FORM_DATA);
    const [isCompleting, setIsCompleting] = useState(false);
    const [errors, setErrors] = useState<Partial<OnboardingFormData>>({});
    const [apiError, setApiError] = useState<string>('');

    // Redirect if profile is already complete
    useEffect(() => {
        if (!profileLoading && isProfileComplete) {
            console.log('[Onboarding] Profile already complete, redirecting to dashboard');
            router.push('/dashboard');
        }
    }, [isProfileComplete, profileLoading, router]);

    // Update form field
    const updateField = useCallback((field: keyof OnboardingFormData, value: string) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: value };
            // Reset sub-niche when niche changes
            if (field === 'niche') {
                updated.subNiche = '';
            }
            return updated;
        });
        // Clear error on change
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    }, [errors]);

    // Validate current step
    const validateStep = useCallback((): boolean => {
        const newErrors: Partial<OnboardingFormData> = {};

        if (currentStep === 1) {
            if (!formData.instagramUsername.trim()) {
                newErrors.instagramUsername = 'Please enter your Instagram username';
            } else if (!formData.instagramUsername.startsWith('@')) {
                newErrors.instagramUsername = 'Username should start with @';
            }
        } else if (currentStep === 2) {
            if (!formData.niche) {
                newErrors.niche = 'Please select your content niche';
            }
            if (!formData.subNiche) {
                newErrors.subNiche = 'Please select your sub-niche';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [currentStep, formData]);

    // Navigate to next step
    const handleNext = useCallback(() => {
        if (!validateStep()) return;

        if (currentStep < TOTAL_STEPS) {
            setDirection(1);
            setCurrentStep(prev => prev + 1);
        } else {
            // Complete onboarding
            handleComplete();
        }
    }, [currentStep, validateStep]);

    // Navigate to previous step
    const handleBack = useCallback(() => {
        if (currentStep > 1) {
            setDirection(-1);
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    // Complete onboarding and redirect
    const handleComplete = useCallback(async () => {
        setIsCompleting(true);
        setApiError('');

        try {
            const response = await fetch('/api/user/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instagramUsername: formData.instagramUsername,
                    niche: formData.niche,
                    subNiche: formData.subNiche,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save onboarding data');
            }

            // Invalidate all relevant caches to refresh data
            await queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            await queryClient.invalidateQueries({ queryKey: ['social-account'] });

            // Small delay for cache invalidation to propagate
            await new Promise(resolve => setTimeout(resolve, 500));

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (error: any) {
            console.error('Onboarding error:', error);
            setApiError(error.message || 'Something went wrong. Please try again.');
            setIsCompleting(false);
        }
    }, [formData, router]);

    // Get sub-niches for selected niche
    const availableSubNiches = formData.niche ? SUB_NICHE_MAPPING[formData.niche] || [] : [];

    return (
        <div data-theme="dark" className="min-h-screen bg-[#020617] text-white flex flex-col relative overflow-hidden">
            {/* Frosted Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '7s' }} />
            </div>

            {/* Header - Centered Logo */}
            <header className="w-full py-10 flex justify-center items-center gap-4 relative z-10">
                <Image
                    src="/T_logo.png"
                    width={42}
                    height={42}
                    alt="Trendsta"
                    className="drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                />
                <span className="text-4xl font-extrabold text-white tracking-tighter">Trendsta</span>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 pb-12 relative z-10 backdrop-blur-[2px]">
                {/* Progress Indicator */}
                {!isCompleting && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10 flex flex-col items-center gap-4"
                    >
                        <div className="flex items-center gap-2">
                            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-700 ${i + 1 === currentStep
                                        ? 'w-12 bg-gradient-to-r from-orange-400 to-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.5)]'
                                        : i + 1 < currentStep
                                            ? 'w-4 bg-blue-500/50'
                                            : 'w-4 bg-white/5'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                            Progress: {currentStep} / {TOTAL_STEPS}
                        </span>
                    </motion.div>
                )}

                {/* Card Container */}
                <div className="w-full max-w-xl">
                    <AnimatePresence mode="wait" custom={direction}>
                        {isCompleting ? (
                            <CompletionState key="completion" />
                        ) : (
                            <motion.div
                                key={currentStep}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className="glass-panel p-8 md:p-12"
                            >
                                {currentStep === 1 && (
                                    <InstagramSlide
                                        value={formData.instagramUsername}
                                        onChange={(val) => updateField('instagramUsername', val)}
                                        error={errors.instagramUsername}
                                    />
                                )}
                                {currentStep === 2 && (
                                    <NicheSlide
                                        niche={formData.niche}
                                        subNiche={formData.subNiche}
                                        availableSubNiches={availableSubNiches}
                                        onNicheChange={(val) => updateField('niche', val)}
                                        onSubNicheChange={(val) => updateField('subNiche', val)}
                                        errors={{ niche: errors.niche, subNiche: errors.subNiche }}
                                    />
                                )}

                                {/* API Error Display */}
                                {apiError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                                    >
                                        <p className="text-sm text-red-400 font-medium">{apiError}</p>
                                    </motion.div>
                                )}


                                {/* Navigation Buttons */}
                                <div className="mt-12 flex items-center justify-between gap-6">
                                    {currentStep > 1 ? (
                                        <button
                                            onClick={handleBack}
                                            className="px-6 py-3.5 text-slate-400 hover:text-white font-semibold rounded-xl transition-all border border-white/5 hover:bg-white/5"
                                        >
                                            Back
                                        </button>
                                    ) : (
                                        <div />
                                    )}
                                    <button
                                        onClick={handleNext}
                                        className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(234,88,12,0.3)] hover:shadow-[0_4px_25px_rgba(234,88,12,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border border-white/10"
                                    >
                                        {currentStep === TOTAL_STEPS ? 'Build My Trendsta Dashboard' : 'Continue'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

// ============================================================
// SLIDE COMPONENTS
// ============================================================

interface InstagramSlideProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

function InstagramSlide({ value, onChange, error }: InstagramSlideProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        // Auto-add @ if not present
        if (val && !val.startsWith('@')) {
            val = '@' + val;
        }
        onChange(val);
    };

    return (
        <motion.div {...fadeInUp} transition={{ duration: 0.4 }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                What's your Instagram username?
            </h2>
            <p className="text-slate-400 mb-10 text-lg leading-relaxed">
                We'll use this to analyze your content performance and identify growth opportunities.
            </p>

            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder="@yourusername"
                    className={`w-full px-6 py-5 text-xl rounded-2xl bg-white/5 border-2 outline-none transition-all duration-300 font-medium ${error
                        ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                        : 'border-white/10 focus:border-blue-500/50 focus:bg-white/10 shadow-inner'
                        }`}
                />
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 text-sm text-red-400 font-semibold flex items-center gap-2"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        {error}
                    </motion.p>
                )}
            </div>

            <p className="mt-6 text-sm text-slate-500 italic">
                Used only for performance and competitor analysis. We never post on your behalf.
            </p>
        </motion.div>
    );
}

interface NicheSlideProps {
    niche: string;
    subNiche: string;
    availableSubNiches: { value: string; label: string }[];
    onNicheChange: (value: string) => void;
    onSubNicheChange: (value: string) => void;
    errors: { niche?: string; subNiche?: string };
}

function NicheSlide({
    niche,
    subNiche,
    availableSubNiches,
    onNicheChange,
    onSubNicheChange,
    errors,
}: NicheSlideProps) {
    return (
        <motion.div {...fadeInUp} transition={{ duration: 0.4 }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                What do you create?
            </h2>
            <p className="text-slate-400 mb-10 text-lg leading-relaxed">
                This helps us curate relevant insights and competitor benchmarks for your space.
            </p>

            <div className="space-y-6">
                {/* Niche Dropdown */}
                <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 px-1">
                        Core Niche
                    </label>
                    <select
                        value={niche}
                        onChange={(e) => onNicheChange(e.target.value)}
                        className={`w-full px-6 py-4 text-lg rounded-2xl bg-white/5 border-2 outline-none transition-all duration-300 appearance-none cursor-pointer font-medium ${errors.niche
                            ? 'border-red-500/50 focus:border-red-500'
                            : 'border-white/10 focus:border-blue-500/50 focus:bg-white/10'
                            }`}
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 1.5rem center',
                            backgroundSize: '1.25rem',
                        }}
                    >
                        <option value="" className="bg-[#1a1f2e]">Select your niche</option>
                        {NICHE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-[#1a1f2e]">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    {errors.niche && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 text-sm text-red-400 font-semibold"
                        >
                            {errors.niche}
                        </motion.p>
                    )}
                </div>

                {/* Sub-Niche Dropdown */}
                <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 px-1">
                        Sub-Niche
                    </label>
                    <select
                        value={subNiche}
                        onChange={(e) => onSubNicheChange(e.target.value)}
                        disabled={!niche}
                        className={`w-full px-6 py-4 text-lg rounded-2xl bg-white/5 border-2 outline-none transition-all duration-300 appearance-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed font-medium ${errors.subNiche
                            ? 'border-red-500/50 focus:border-red-500'
                            : 'border-white/10 focus:border-blue-500/50 focus:bg-white/10'
                            }`}
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 1.5rem center',
                            backgroundSize: '1.25rem',
                        }}
                    >
                        <option value="" className="bg-[#1a1f2e]">
                            {niche ? 'Select your specialization' : 'First select a niche'}
                        </option>
                        {availableSubNiches.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-[#1a1f2e]">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    {errors.subNiche && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 text-sm text-red-400 font-semibold"
                        >
                            {errors.subNiche}
                        </motion.p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// interface CreatorProfileSlideProps {
//     value: string;
//     onChange: (value: string) => void;
//     error?: string;
// }

// function CreatorProfileSlide({ value, onChange, error }: CreatorProfileSlideProps) {
//     return (
//         <motion.div {...fadeInUp} transition={{ duration: 0.4 }}>
//             <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-3">
//                 Which best describes you?
//             </h2>
//             <p className="text-slate-500 mb-8">
//                 This helps us benchmark and tailor insights accurately.
//             </p>

//             {/* <div className="grid gap-3">
//                 {CREATOR_PROFILE_OPTIONS.map((option) => (
//                     <motion.button
//                         key={option.value}
//                         onClick={() => onChange(option.value)}
//                         whileHover={{ scale: 1.01 }}
//                         whileTap={{ scale: 0.99 }}
//                         className={`w-full p-5 text-left border-2 rounded-xl transition-all duration-200 ${value === option.value
//                             ? 'border-[#f97316] bg-orange-50/50 shadow-md shadow-orange-100'
//                             : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-100/50'
//                             }`}
//                     >
//                         <div className="flex items-start justify-between">
//                             <div>
//                                 <h3 className={`font-semibold ${value === option.value ? 'text-[#1e3a5f]' : 'text-slate-700'
//                                     }`}>
//                                     {option.label}
//                                 </h3>
//                                 <p className="mt-1 text-sm text-slate-500">
//                                     {option.description}
//                                 </p>
//                             </div>
//                             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${value === option.value
//                                 ? 'border-[#f97316] bg-[#f97316]'
//                                 : 'border-slate-300'
//                                 }`}>
//                                 {value === option.value && (
//                                     <motion.svg
//                                         initial={{ scale: 0 }}
//                                         animate={{ scale: 1 }}
//                                         className="w-3 h-3 text-white"
//                                         fill="currentColor"
//                                         viewBox="0 0 20 20"
//                                     >
//                                         <path
//                                             fillRule="evenodd"
//                                             d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                                             clipRule="evenodd"
//                                         />
//                                     </motion.svg>
//                                 )}
//                             </div>
//                         </div>
//                     </motion.button>
//                 ))}
//             </div> */}

//             {error && (
//                 <motion.p
//                     initial={{ opacity: 0, y: -5 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mt-4 text-sm text-red-500"
//                 >
//                     {error}
//                 </motion.p>
//             )}
//         </motion.div>
//     );
// }

// ============================================================
// COMPLETION STATE
// ============================================================

function CompletionState() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-10 md:p-14 text-center"
        >
            {/* Loading Animation */}
            <div className="flex justify-center mb-8">
                <div className="relative w-20 h-20">
                    {/* Outer ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-4 border-slate-100"
                    />
                    {/* Spinning ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#f97316] border-r-[#1e3a5f]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring' }}
                            className="w-10 h-10 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] rounded-xl flex items-center justify-center"
                        >
                            <span className="text-white font-bold text-xl">T</span>
                        </motion.div>
                    </div>
                </div>
            </div>

            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-3"
            >
                Building Your Dashboard
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-slate-500"
            >
                We're configuring your personalized insights...
            </motion.p>

            {/* Progress dots */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center gap-1.5 mt-6"
            >
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-[#f97316]"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                        }}
                    />
                ))}
            </motion.div>
        </motion.div>
    );
}
