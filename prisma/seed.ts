import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Starting seed...");

    // ============================================
    // CREATE USERS
    // ============================================
    console.log("👤 Creating users...");

    const user1 = await prisma.user.create({
        data: {
            email: "alice@example.com",
            name: "Alice Johnson",
            emailVerified: true,
            image: "https://i.pravatar.cc/150?u=alice",
        },
    });

    const user2 = await prisma.user.create({
        data: {
            email: "bob@example.com",
            name: "Bob Smith",
            emailVerified: true,
            image: "https://i.pravatar.cc/150?u=bob",
        },
    });

    const user3 = await prisma.user.create({
        data: {
            email: "charlie@example.com",
            name: "Charlie Brown",
            emailVerified: false,
            image: "https://i.pravatar.cc/150?u=charlie",
        },
    });

    console.log(`✅ Created users: ${user1.name}, ${user2.name}, ${user3.name}`);

    // ============================================
    // CREATE SOCIAL ACCOUNTS
    // ============================================
    console.log("📱 Creating social accounts...");

    const socialAccount1 = await prisma.socialAccount.create({
        data: {
            userId: user1.id,
            username: "alice_creates",
        },
    });

    const socialAccount2 = await prisma.socialAccount.create({
        data: {
            userId: user2.id,
            username: "bob_the_influencer",
        },
    });

    const socialAccount3 = await prisma.socialAccount.create({
        data: {
            userId: user3.id,
            username: "charlie_vibes",
        },
    });

    console.log(
        `✅ Created social accounts: ${socialAccount1.username}, ${socialAccount2.username}, ${socialAccount3.username}`
    );

    // ============================================
    // CREATE RESEARCH ENTRIES
    // ============================================
    console.log("🔬 Creating research entries...");

    const research1 = await prisma.research.create({
        data: {
            socialAccountId: socialAccount1.id,
        },
    });

    const research2 = await prisma.research.create({
        data: {
            socialAccountId: socialAccount2.id,
        },
    });

    const research3 = await prisma.research.create({
        data: {
            socialAccountId: socialAccount3.id,
        },
    });

    console.log("✅ Created research entries");

    // ============================================
    // CREATE SCRIPT SUGGESTIONS
    // ============================================
    console.log("📝 Creating script suggestions...");

    await prisma.scriptSuggestions.createMany({
        data: [
            {
                researchId: research1.id,
                scripts: [
                    {
                        title: "Morning Routine Hack",
                        hook: "You've been doing your morning routine wrong...",
                        body: "Here's the 5-minute hack that changed my life",
                        cta: "Follow for more productivity tips!",
                        estimatedViews: 50000,
                    },
                    {
                        title: "Productivity Secret",
                        hook: "CEOs don't want you to know this...",
                        body: "The one tool I use to 10x my output",
                        cta: "Save this for later!",
                        estimatedViews: 75000,
                    },
                ],
            },
            {
                researchId: research2.id,
                scripts: [
                    {
                        title: "Fitness Transformation",
                        hook: "I lost 30 pounds in 90 days...",
                        body: "Here's exactly what I ate and how I trained",
                        cta: "Comment 'PLAN' for the full guide!",
                        estimatedViews: 100000,
                    },
                ],
            },
            {
                researchId: research3.id,
                scripts: [
                    {
                        title: "Travel on a Budget",
                        hook: "I traveled to 10 countries for under $5000...",
                        body: "These are the apps and tricks I used",
                        cta: "Share with someone who needs to see this!",
                        estimatedViews: 80000,
                    },
                ],
            },
        ],
    });

    console.log("✅ Created script suggestions");

    // ============================================
    // CREATE OVERALL STRATEGY
    // ============================================
    console.log("🎯 Creating overall strategies...");

    await prisma.overallStrategy.createMany({
        data: [
            {
                researchId: research1.id,
                data: {
                    summary: "Focus on productivity and lifestyle content",
                    recommendedPostingTimes: ["9:00 AM", "6:00 PM", "9:00 PM"],
                    contentPillars: ["Productivity", "Morning Routines", "Life Hacks"],
                    weeklyPostingFrequency: 5,
                    audienceInsights: {
                        primaryAge: "25-34",
                        interests: ["self-improvement", "entrepreneurship"],
                        peakEngagementDays: ["Tuesday", "Thursday", "Sunday"],
                    },
                },
            },
            {
                researchId: research2.id,
                data: {
                    summary: "Fitness transformation and motivation content",
                    recommendedPostingTimes: ["6:00 AM", "12:00 PM", "7:00 PM"],
                    contentPillars: ["Fitness", "Nutrition", "Motivation"],
                    weeklyPostingFrequency: 7,
                    audienceInsights: {
                        primaryAge: "18-34",
                        interests: ["gym", "health", "bodybuilding"],
                        peakEngagementDays: ["Monday", "Wednesday", "Saturday"],
                    },
                },
            },
            {
                researchId: research3.id,
                data: {
                    summary: "Travel and adventure content on a budget",
                    recommendedPostingTimes: ["10:00 AM", "3:00 PM", "8:00 PM"],
                    contentPillars: ["Budget Travel", "Adventure", "Hidden Gems"],
                    weeklyPostingFrequency: 4,
                    audienceInsights: {
                        primaryAge: "22-35",
                        interests: ["travel", "photography", "culture"],
                        peakEngagementDays: ["Friday", "Saturday", "Sunday"],
                    },
                },
            },
        ],
    });

    console.log("✅ Created overall strategies");

    // ============================================
    // CREATE USER RESEARCH
    // ============================================
    console.log("👤 Creating user research...");

    await prisma.userResearch.createMany({
        data: [
            {
                researchId: research1.id,
                data: {
                    profile: {
                        username: "alice_creates",
                        followers: 15000,
                        following: 500,
                        postsCount: 120,
                        bio: "Productivity enthusiast | Morning person | Coffee lover ☕",
                        engagementRate: 4.5,
                    },
                    topReels: [
                        { id: "reel-1", views: 50000, likes: 3500, comments: 120 },
                        { id: "reel-2", views: 35000, likes: 2800, comments: 95 },
                    ],
                    underperformingReels: [
                        { id: "reel-10", views: 1200, likes: 45, comments: 3 },
                    ],
                    insights: {
                        avgViews: 15000,
                        avgLikes: 1200,
                        avgComments: 45,
                        bestPerformingFormat: "talking-head",
                    },
                },
            },
            {
                researchId: research2.id,
                data: {
                    profile: {
                        username: "bob_the_influencer",
                        followers: 85000,
                        following: 300,
                        postsCount: 450,
                        bio: "Fitness Coach | Transformation Specialist 💪",
                        engagementRate: 6.2,
                    },
                    topReels: [
                        { id: "reel-1", views: 250000, likes: 18000, comments: 800 },
                        { id: "reel-2", views: 180000, likes: 12000, comments: 550 },
                    ],
                    underperformingReels: [
                        { id: "reel-15", views: 5000, likes: 200, comments: 15 },
                    ],
                    insights: {
                        avgViews: 45000,
                        avgLikes: 3500,
                        avgComments: 150,
                        bestPerformingFormat: "transformation",
                    },
                },
            },
            {
                researchId: research3.id,
                data: {
                    profile: {
                        username: "charlie_vibes",
                        followers: 8000,
                        following: 800,
                        postsCount: 65,
                        bio: "Wanderer 🌍 | Budget Travel Tips | 30+ Countries",
                        engagementRate: 5.1,
                    },
                    topReels: [
                        { id: "reel-1", views: 30000, likes: 2200, comments: 85 },
                    ],
                    underperformingReels: [
                        { id: "reel-8", views: 800, likes: 30, comments: 2 },
                    ],
                    insights: {
                        avgViews: 8000,
                        avgLikes: 600,
                        avgComments: 25,
                        bestPerformingFormat: "cinematic",
                    },
                },
            },
        ],
    });

    console.log("✅ Created user research");

    // ============================================
    // CREATE COMPETITOR RESEARCH
    // ============================================
    console.log("🏆 Creating competitor research...");

    await prisma.competitorResearch.createMany({
        data: [
            {
                researchId: research1.id,
                data: {
                    competitors: [
                        {
                            username: "productivity_guru",
                            followers: 500000,
                            engagementRate: 5.8,
                            topContent: ["morning routines", "time blocking", "habit stacking"],
                            avgViews: 150000,
                        },
                        {
                            username: "life_hacker_pro",
                            followers: 280000,
                            engagementRate: 4.2,
                            topContent: ["productivity apps", "shortcuts", "automation"],
                            avgViews: 85000,
                        },
                    ],
                    insights: {
                        contentGaps: ["evening routines", "weekend productivity"],
                        trendingFormats: ["day-in-the-life", "before-after"],
                    },
                },
            },
            {
                researchId: research2.id,
                data: {
                    competitors: [
                        {
                            username: "fitness_king",
                            followers: 2000000,
                            engagementRate: 4.5,
                            topContent: ["workout splits", "meal prep", "supplements"],
                            avgViews: 500000,
                        },
                    ],
                    insights: {
                        contentGaps: ["home workouts", "no-equipment routines"],
                        trendingFormats: ["transformation-reveal", "workout-pov"],
                    },
                },
            },
            {
                researchId: research3.id,
                data: {
                    competitors: [
                        {
                            username: "budget_backpacker",
                            followers: 150000,
                            engagementRate: 6.0,
                            topContent: ["cheap flights", "hostel reviews", "street food"],
                            avgViews: 60000,
                        },
                    ],
                    insights: {
                        contentGaps: ["luxury on budget", "work-travel balance"],
                        trendingFormats: ["travel-vlog", "hidden-spots"],
                    },
                },
            },
        ],
    });

    console.log("✅ Created competitor research");

    // ============================================
    // CREATE NICHE RESEARCH
    // ============================================
    console.log("🎨 Creating niche research...");

    await prisma.nicheResearch.createMany({
        data: [
            {
                researchId: research1.id,
                data: {
                    niche: "Productivity & Self-Improvement",
                    trendingTopics: [
                        "AI productivity tools",
                        "dopamine detox",
                        "monk mode",
                    ],
                    viralFormats: ["listicles", "controversial-takes", "myth-busting"],
                    fypReels: [
                        { id: "fyp-1", views: 2000000, topic: "morning routine" },
                        { id: "fyp-2", views: 1500000, topic: "productivity apps" },
                    ],
                    audienceSize: 50000000,
                },
            },
            {
                researchId: research2.id,
                data: {
                    niche: "Fitness & Health",
                    trendingTopics: [
                        "protein myths",
                        "12-3-30 workout",
                        "creatine benefits",
                    ],
                    viralFormats: ["transformation", "workout-tutorial", "gym-fails"],
                    fypReels: [
                        { id: "fyp-1", views: 5000000, topic: "body transformation" },
                        { id: "fyp-2", views: 3000000, topic: "gym motivation" },
                    ],
                    audienceSize: 150000000,
                },
            },
            {
                researchId: research3.id,
                data: {
                    niche: "Travel & Adventure",
                    trendingTopics: [
                        "hidden gems Europe",
                        "solo female travel",
                        "digital nomad",
                    ],
                    viralFormats: ["drone-shots", "travel-hacks", "destination-reveal"],
                    fypReels: [
                        { id: "fyp-1", views: 3500000, topic: "cheap destinations" },
                        { id: "fyp-2", views: 2800000, topic: "travel fails" },
                    ],
                    audienceSize: 80000000,
                },
            },
        ],
    });

    console.log("✅ Created niche research");

    // ============================================
    // CREATE TWITTER RESEARCH
    // ============================================
    console.log("🐦 Creating Twitter research...");

    await prisma.twitterResearch.createMany({
        data: [
            {
                researchId: research1.id,
                latestData: {
                    tweets: [
                        {
                            id: "tweet-1",
                            text: "The best productivity hack is actually getting enough sleep",
                            likes: 5000,
                            retweets: 800,
                            timestamp: "2024-01-20T10:00:00Z",
                        },
                        {
                            id: "tweet-2",
                            text: "Stop romanticizing hustle culture. Rest is productive.",
                            likes: 12000,
                            retweets: 2500,
                            timestamp: "2024-01-19T14:30:00Z",
                        },
                    ],
                    trending: ["#ProductivityTips", "#MorningRoutine"],
                },
                topData: {
                    tweets: [
                        {
                            id: "top-tweet-1",
                            text: "I spent 10 years studying productivity. Here's what actually works (thread):",
                            likes: 45000,
                            retweets: 12000,
                            timestamp: "2024-01-15T08:00:00Z",
                        },
                    ],
                    insights: {
                        bestPerformingFormat: "threads",
                        avgEngagement: 3500,
                    },
                },
            },
            {
                researchId: research2.id,
                latestData: {
                    tweets: [
                        {
                            id: "tweet-1",
                            text: "Your genetics aren't the problem. Your consistency is.",
                            likes: 8000,
                            retweets: 1500,
                            timestamp: "2024-01-20T06:00:00Z",
                        },
                    ],
                    trending: ["#FitnessMotivation", "#GymLife"],
                },
                topData: {
                    tweets: [
                        {
                            id: "top-tweet-1",
                            text: "I went from 250lbs to 180lbs. Here's my entire transformation (with photos):",
                            likes: 85000,
                            retweets: 25000,
                            timestamp: "2024-01-10T12:00:00Z",
                        },
                    ],
                    insights: {
                        bestPerformingFormat: "photo-threads",
                        avgEngagement: 8500,
                    },
                },
            },
            {
                researchId: research3.id,
                latestData: {
                    tweets: [
                        {
                            id: "tweet-1",
                            text: "Just booked a round-trip to Japan for $400. Here's how:",
                            likes: 15000,
                            retweets: 5000,
                            timestamp: "2024-01-20T15:00:00Z",
                        },
                    ],
                    trending: ["#TravelHacks", "#BudgetTravel"],
                },
                topData: {
                    tweets: [
                        {
                            id: "top-tweet-1",
                            text: "10 countries I visited for under $50/day (with exact costs):",
                            likes: 62000,
                            retweets: 18000,
                            timestamp: "2024-01-05T10:00:00Z",
                        },
                    ],
                    insights: {
                        bestPerformingFormat: "listicle-threads",
                        avgEngagement: 6200,
                    },
                },
            },
        ],
    });

    console.log("✅ Created Twitter research");

    // ============================================
    // SUMMARY
    // ============================================
    console.log("\n🎉 Seed completed successfully!");
    console.log("Created:");
    console.log("  - 3 Users");
    console.log("  - 3 Sessions");
    console.log("  - 3 Accounts");
    console.log("  - 1 Verification");
    console.log("  - 3 Social Accounts");
    console.log("  - 3 Research entries");
    console.log("  - 3 Script Suggestions");
    console.log("  - 3 Overall Strategies");
    console.log("  - 3 User Research");
    console.log("  - 3 Competitor Research");
    console.log("  - 3 Niche Research");
    console.log("  - 3 Twitter Research");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
