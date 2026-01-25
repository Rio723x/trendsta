// ============================================================
// ONBOARDING DATA - Niches, Sub-Niches, and Creator Profiles
// ============================================================

export interface NicheOption {
    value: string;
    label: string;
}

export interface SubNicheMapping {
    [niche: string]: NicheOption[];
}

export interface CreatorProfileOption {
    value: string;
    label: string;
    description: string;
}

// Core niches - curated professional categories only
export const NICHE_OPTIONS: NicheOption[] = [
    { value: 'technology-ai', label: 'Technology & AI' },
    { value: 'business-startups', label: 'Business & Startups' },
    { value: 'finance-investing', label: 'Finance & Investing' },
    { value: 'education-edtech', label: 'Education & EdTech' },
    { value: 'health-fitness', label: 'Health & Fitness' },
    { value: 'fashion-lifestyle', label: 'Fashion & Lifestyle' },
    { value: 'travel-experiences', label: 'Travel & Experiences' },
    { value: 'marketing-branding', label: 'Marketing & Branding' },
    { value: 'creators-agencies', label: 'Creators & Agencies (B2B)' },
];

// Sub-niches dynamically populated based on core niche
export const SUB_NICHE_MAPPING: SubNicheMapping = {
    'technology-ai': [
        { value: 'genai', label: 'Generative AI & LLMs' },
        { value: 'saas', label: 'SaaS & Software' },
        { value: 'machine-learning', label: 'Machine Learning & Data Science' },
        { value: 'developer-tools', label: 'Developer Tools & Productivity' },
        { value: 'cybersecurity', label: 'Cybersecurity & Privacy' },
        { value: 'hardware-gadgets', label: 'Hardware & Gadgets' },
    ],
    'business-startups': [
        { value: 'entrepreneurship', label: 'Entrepreneurship & Founders' },
        { value: 'venture-capital', label: 'Venture Capital & Fundraising' },
        { value: 'productivity', label: 'Productivity & Leadership' },
        { value: 'remote-work', label: 'Remote Work & Future of Work' },
        { value: 'ecommerce', label: 'E-commerce & D2C' },
        { value: 'consulting', label: 'Consulting & Advisory' },
    ],
    'finance-investing': [
        { value: 'personal-finance', label: 'Personal Finance & Budgeting' },
        { value: 'stock-markets', label: 'Stock Markets & Trading' },
        { value: 'crypto-web3', label: 'Crypto & Web3' },
        { value: 'real-estate', label: 'Real Estate Investing' },
        { value: 'wealth-management', label: 'Wealth Management' },
        { value: 'fintech', label: 'FinTech & Payments' },
    ],
    'education-edtech': [
        { value: 'online-courses', label: 'Online Courses & Coaching' },
        { value: 'skill-development', label: 'Skill Development' },
        { value: 'academic', label: 'Academic & Research' },
        { value: 'career-guidance', label: 'Career Guidance' },
        { value: 'language-learning', label: 'Language Learning' },
        { value: 'stem-education', label: 'STEM Education' },
    ],
    'health-fitness': [
        { value: 'workout-training', label: 'Workout & Training' },
        { value: 'nutrition', label: 'Nutrition & Diet' },
        { value: 'mental-health', label: 'Mental Health & Wellness' },
        { value: 'yoga-meditation', label: 'Yoga & Meditation' },
        { value: 'sports', label: 'Sports & Athletics' },
        { value: 'healthcare', label: 'Healthcare & Medical' },
    ],
    'fashion-lifestyle': [
        { value: 'fashion-trends', label: 'Fashion & Trends' },
        { value: 'luxury-brands', label: 'Luxury & Premium Brands' },
        { value: 'beauty-skincare', label: 'Beauty & Skincare' },
        { value: 'home-interior', label: 'Home & Interior Design' },
        { value: 'sustainable', label: 'Sustainable & Ethical Living' },
        { value: 'personal-styling', label: 'Personal Styling' },
    ],
    'travel-experiences': [
        { value: 'travel-guides', label: 'Travel Guides & Tips' },
        { value: 'luxury-travel', label: 'Luxury Travel' },
        { value: 'adventure', label: 'Adventure & Outdoor' },
        { value: 'food-travel', label: 'Food & Culinary Travel' },
        { value: 'digital-nomad', label: 'Digital Nomad Lifestyle' },
        { value: 'cultural-heritage', label: 'Cultural & Heritage' },
    ],
    'marketing-branding': [
        { value: 'social-media', label: 'Social Media Marketing' },
        { value: 'content-strategy', label: 'Content Strategy' },
        { value: 'brand-building', label: 'Brand Building' },
        { value: 'performance-marketing', label: 'Performance Marketing' },
        { value: 'seo-growth', label: 'SEO & Organic Growth' },
        { value: 'influencer-marketing', label: 'Influencer Marketing' },
    ],
    'creators-agencies': [
        { value: 'creator-economy', label: 'Creator Economy' },
        { value: 'agency-services', label: 'Agency Services' },
        { value: 'talent-management', label: 'Talent Management' },
        { value: 'production', label: 'Content Production' },
        { value: 'monetization', label: 'Monetization Strategies' },
        { value: 'multi-platform', label: 'Multi-Platform Management' },
    ],
};

// Creator profile options
export const CREATOR_PROFILE_OPTIONS: CreatorProfileOption[] = [
    {
        value: 'solo-creator',
        label: 'Solo Content Creator',
        description: 'Individual creating and managing content independently',
    },
    {
        value: 'personal-brand',
        label: 'Personal Brand / Thought Leader',
        description: 'Building authority and influence in your domain',
    },
    {
        value: 'startup-brand',
        label: 'Startup or Brand Account',
        description: 'Company or product-focused content strategy',
    },
    {
        value: 'agency',
        label: 'Content / Growth Agency',
        description: 'Managing multiple creators or brand accounts',
    },
];

// Form data types
export interface OnboardingFormData {
    instagramUsername: string;
    niche: string;
    subNiche: string;
    creatorProfile: string;
}

export const INITIAL_FORM_DATA: OnboardingFormData = {
    instagramUsername: '',
    niche: '',
    subNiche: '',
    creatorProfile: '',
};
