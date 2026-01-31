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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white flex flex-col">
            {/* Header - Centered Logo */}
            <header className="w-full py-8 flex justify-center">
                <Image
                    src="/logo3.png"
                    alt="TrendSta"
                    width={180}
                    height={50}
                    priority
                />
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
                {/* Progress Indicator */}
                {!isCompleting && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex flex-col items-center gap-4"
                    >
                        <div className="flex items-center gap-2">
                            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-2 rounded-full transition-all duration-300 ${i + 1 === currentStep
                                        ? 'w-8 bg-[#f97316]'
                                        : i + 1 < currentStep
                                            ? 'w-2 bg-[#1e3a5f]'
                                            : 'w-2 bg-slate-200'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-slate-500 font-medium">
                            Step {currentStep} of {TOTAL_STEPS}
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
                                className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10"
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
                                        className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl"
                                    >
                                        <p className="text-sm text-red-600">{apiError}</p>
                                    </motion.div>
                                )}


                                {/* Navigation Buttons */}
                                <div className="mt-10 flex items-center justify-between">
                                    {currentStep > 1 ? (
                                        <button
                                            onClick={handleBack}
                                            className="px-6 py-3 text-slate-600 hover:text-[#1e3a5f] font-medium rounded-xl transition-colors"
                                        >
                                            Back
                                        </button>
                                    ) : (
                                        <div />
                                    )}
                                    <button
                                        onClick={handleNext}
                                        className="px-8 py-3.5 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-semibold rounded-xl shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
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
            <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-3">
                What's your Instagram username?
            </h2>
            <p className="text-slate-500 mb-8">
                We'll use this to analyze your content performance and identify growth opportunities.
            </p>

            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder="@yourusername"
                    className={`w-full px-5 py-4 text-lg border-2 rounded-xl bg-slate-50/50 focus:bg-white outline-none transition-all duration-200 ${error
                        ? 'border-red-300 focus:border-red-400'
                        : 'border-slate-200 focus:border-[#1e3a5f]'
                        }`}
                />
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-500"
                    >
                        {error}
                    </motion.p>
                )}
            </div>

            <p className="mt-4 text-xs text-slate-400">
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
            <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-3">
                What type of content do you create?
            </h2>
            <p className="text-slate-500 mb-8">
                This helps us curate relevant insights and competitor benchmarks for your space.
            </p>

            <div className="space-y-5">
                {/* Niche Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Core Niche
                    </label>
                    <select
                        value={niche}
                        onChange={(e) => onNicheChange(e.target.value)}
                        className={`w-full px-5 py-4 text-base border-2 rounded-xl bg-slate-50/50 focus:bg-white outline-none transition-all duration-200 appearance-none cursor-pointer ${errors.niche
                            ? 'border-red-300 focus:border-red-400'
                            : 'border-slate-200 focus:border-[#1e3a5f]'
                            }`}
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 1rem center',
                            backgroundSize: '1.5rem',
                        }}
                    >
                        <option value="">Select your niche</option>
                        {NICHE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    {errors.niche && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-red-500"
                        >
                            {errors.niche}
                        </motion.p>
                    )}
                </div>

                {/* Sub-Niche Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Sub-Niche
                    </label>
                    <select
                        value={subNiche}
                        onChange={(e) => onSubNicheChange(e.target.value)}
                        disabled={!niche}
                        className={`w-full px-5 py-4 text-base border-2 rounded-xl bg-slate-50/50 focus:bg-white outline-none transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${errors.subNiche
                            ? 'border-red-300 focus:border-red-400'
                            : 'border-slate-200 focus:border-[#1e3a5f]'
                            }`}
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 1rem center',
                            backgroundSize: '1.5rem',
                        }}
                    >
                        <option value="">
                            {niche ? 'Select your specialization' : 'First select a niche'}
                        </option>
                        {availableSubNiches.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    {errors.subNiche && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-red-500"
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
