import { PrismaClient, TweetCategory } from '../generated/prisma/client'
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    console.log('Start seeding ...')

    // Note: Deletion logic removed as requested (DB is fresh)

    const usersConfig = [
        {
            email: 'alice@trendsta.com',
            name: 'Alice Creator',
            accounts: 1,
            niche: 'Tech & AI',
        },
        {
            email: 'bob@trendsta.com',
            name: 'Bob Lifestyle',
            accounts: 2,
            niche: 'Fitness & Health',
        }
    ];

    for (const config of usersConfig) {
        const user = await prisma.user.create({
            data: {
                email: config.email,
                name: config.name,
            }
        });

        console.log(`Created user: ${user.name}`);

        // Create SocialAccounts based on config
        for (let i = 0; i < config.accounts; i++) {
            const username = `${config.email.split('@')[0]}_${i + 1}`;
            const socialAccount = await prisma.socialAccount.create({
                data: {
                    userId: user.id,
                    username: username,
                }
            });
            console.log(`  Created SocialAccount: ${socialAccount.username}`);

            // Create Research for this account
            const research = await prisma.research.create({
                data: {
                    socialAccountId: socialAccount.id,
                }
            });
            console.log(`    Created Research for ${username}`);

            // --- DATA GENERATION (ScriptIdeas, Summary, Tweets, Performance) ---

            // 1. Script Ideas (3 per research)
            await prisma.scriptIdea.createMany({
                data: [
                    {
                        researchId: research.id,
                        type: 'educational',
                        rank: 1,
                        topicTitle: `How to master ${config.niche} in 2026`,
                        scriptTitle: `The Ultimate Guide to ${config.niche}`,
                        viralPotentialScore: 9.2,
                        estimatedDuration: '60s',
                        fullText: `Here is the secret to mastering ${config.niche}... First, focus on consistency...`,
                        scriptWordCount: 150,
                        scriptHook: `Stop making this ${config.niche} mistake.`,
                        scriptBuildup: 'I used to struggle with this too...',
                        scriptValue: 'Here are 3 tips to fix it completely.',
                        scriptCta: 'Save this for later.',
                        captionFull: `Mastering ${config.niche} is easier than you think. #Trendsta #${config.niche.split(' ')[0]}`,
                        captionFirstLine: `Mastering ${config.niche} is easier than you think.`,
                        hashtagsPrimary: [`#${config.niche.split(' ')[0]}`],
                        hashtagsNiche: [`#${config.niche.replace(/\s/g, '')}`],
                        hashtagsTrending: ['#ViralTips'],
                        hashtagsAll: [`#${config.niche.split(' ')[0]}`, '#ViralTips'],
                        hashtagsCount: 2,
                        targetAudience: 'Beginners',
                        emotionalTrigger: 'Hope',
                        contentGapAddressed: 'Actionable steps',
                        whyThisWorks: 'Direct value add',
                        competitorReference: 'None',
                        generatedAt: new Date(),
                    },
                    {
                        researchId: research.id,
                        type: 'controversial',
                        rank: 2,
                        topicTitle: `Why ${config.niche} is dead`,
                        scriptTitle: ` Is ${config.niche} actually over?`,
                        viralPotentialScore: 8.5,
                        estimatedDuration: '45s',
                        fullText: `Everyone says ${config.niche} is booming, but the data says otherwise...`,
                        scriptWordCount: 120,
                        scriptHook: `Unpopular opinion: ${config.niche} is changing fast.`,
                        scriptBuildup: 'Look at the recent trends...',
                        scriptValue: 'You need to pivot to this new strategy.',
                        scriptCta: 'Comment your thoughts.',
                        captionFull: `Hard truth about ${config.niche}. #Truth #${config.niche.split(' ')[0]}`,
                        captionFirstLine: `Hard truth about ${config.niche}.`,
                        hashtagsPrimary: [`#${config.niche.split(' ')[0]}`],
                        hashtagsNiche: ['#TrendAnalysis'],
                        hashtagsTrending: ['#HotTake'],
                        hashtagsAll: [`#${config.niche.split(' ')[0]}`, '#HotTake'],
                        hashtagsCount: 2,
                        targetAudience: 'Experts',
                        emotionalTrigger: 'Fear/FOMO',
                        contentGapAddressed: 'Market shifts',
                        whyThisWorks: 'Pattern interrupt',
                        competitorReference: 'Guru X',
                        generatedAt: new Date(),
                    },
                    {
                        researchId: research.id,
                        type: 'entertainment',
                        rank: 3,
                        topicTitle: `${config.niche} Fail Compilation`,
                        scriptTitle: `Funny ${config.niche} moments`,
                        viralPotentialScore: 8.0,
                        estimatedDuration: '30s',
                        fullText: `Wait for the end... that was unexpected!`,
                        scriptWordCount: 50,
                        scriptHook: `You won't believe what happened.`,
                        scriptBuildup: 'Everything was going fine until...',
                        scriptValue: 'A good laugh.',
                        scriptCta: 'Share with a friend.',
                        captionFull: `LOL moment. #${config.niche.split(' ')[0]} #Funny`,
                        captionFirstLine: `LOL moment.`,
                        hashtagsPrimary: ['#Funny'],
                        hashtagsNiche: [`#${config.niche.replace(/\s/g, '')}`],
                        hashtagsTrending: ['#Viral'],
                        hashtagsAll: ['#Funny', '#Viral'],
                        hashtagsCount: 2,
                        targetAudience: 'General',
                        emotionalTrigger: 'Humor',
                        contentGapAddressed: 'Entertainment',
                        whyThisWorks: 'Shareability',
                        competitorReference: 'None',
                        generatedAt: new Date(),
                    }
                ]
            });

            // 2. Research Summary
            await prisma.researchSummary.create({
                data: {
                    researchId: research.id,
                    type: 'comprehensive',
                    instagramInsights: 'Reels under 30s performing best.',
                    twitterInsights: 'Threads about tools are viral.',
                    competitorInsights: 'Competitors are posting daily.',
                    viralTriggers: 'Before/After transformations.',
                    contentGap: 'Detailed tutorials for intermediates.',
                    postingTimes: '6 PM EST seems optimal.',
                    hookFormula: 'Negative Hook + Solution',
                    instagramSummaryResearch: 'Focus on high quality audio.',
                    generatedAt: new Date(),
                }
            });

            // 3. Tweets (5 per research)
            const tweetsData = [];
            for (let t = 0; t < 5; t++) {
                tweetsData.push({
                    researchId: research.id,
                    id: `tweet-${user.id}-${research.id}-${t}`, // Manual ID
                    category: t < 3 ? TweetCategory.TOP : TweetCategory.LATEST,
                    url: `https://twitter.com/user/status/${Date.now()}${t}`,
                    text: `This is tweet #${t} about ${config.niche}. Insights are key! 🚀`,
                    hook: `Tweet hook #${t}`,
                    wordCount: 20,
                    charCount: 120,
                    hasQuestion: t % 2 === 0,
                    hasEmoji: true,
                    hasNumbers: false,
                    contentFormat: 'Thread',
                    author: 'twitter_guru',
                    authorName: 'Twitter Guru',
                    authorFollowers: 10000 + t * 100,
                    isVerified: true,
                    isBlueVerified: true,
                    authorProfilePic: 'https://placehold.co/50',
                    likes: 500 + t * 50,
                    retweets: 100 + t * 10,
                    replies: 50 + t,
                    quotes: 10,
                    bookmarks: 200,
                    views: 50000,
                    totalEngagement: 860 + t * 61,
                    engagementRate: 0.05,
                    viralScore: 8.5,
                    postedAt: new Date(),
                    postDate: new Date(),
                    ageHours: 2.5,
                    ageDays: 0.1,
                    postHour: 14,
                    postDay: 'Monday',
                    language: 'en',
                    hashtags: ['#growth', `#${config.niche.split(' ')[0]}`],
                    mentions: [],
                    mediaType: t % 2 === 0 ? 'image' : null,
                    mediaUrl: t % 2 === 0 ? 'https://placehold.co/600x400' : null,
                    hasMedia: t % 2 === 0,
                    hasLinks: false,
                    isReply: false,
                    isPinned: t === 0,
                    rank: t + 1,
                    hasEarlyTraction: true,
                    isThread: true
                });
            }
            await prisma.tweet.createMany({ data: tweetsData });


            // 4. Performance Report
            const perfReport = await prisma.performanceReport.create({
                data: {
                    researchId: research.id,
                    profileUsername: username,
                    profileFullName: user.name,
                    profileTotalReels: 150,
                    totalViews: 1000000,
                    totalLikes: 50000,
                    totalComments: 2000,
                    totalShares: 5000,
                    totalSaves: 10000,
                    avgViews: 6600.0,
                    avgLikes: 330.0,
                    avgComments: 13.0,
                    avgDuration: 45.0,
                    avgEngagement: 0.05,
                    transcriptCoverage: 0.9,
                    avgWPM: 140.0,
                    commentsTotal: 2000,
                    commentsUniqueCommenters: 1500,
                    benchmarkViewsToBeat: 10000,
                    benchmarkLikesToBeat: 500,
                    benchmarkEngagementToBeat: 0.06,
                    benchmarkDurationSweetSpot: 35.0,
                    benchmarkSpeakingPace: 150.0,
                    benchmarkTopPerformerScore: 9.0,
                    topHashtags: JSON.stringify(['#viral', '#trending', `#${config.niche.split(' ')[0]}`]),
                    insights: ['Post more reels', 'Use trending audio'],
                }
            });

            // 4.1. Reels (5 per report)
            const reelsData = [];
            for (let r = 0; r < 5; r++) {
                reelsData.push({
                    id: `reel-${user.id}-${research.id}-${r}`,
                    performanceReportId: perfReport.id,
                    url: `https://instagram.com/reel/${Date.now()}${r}`,
                    thumbnail: 'https://placehold.co/300x500',
                    rank: r + 1,
                    velocityScore: 1.5,
                    finalScore: 8.0 + r * 0.2,
                    ageHours: 24.0 * (r + 1),
                    ageLabel: `${r + 1}d ago`,
                    engagementRate: 0.04 + (r * 0.01),
                    commentToLikeRatio: 0.05,
                    isQualityEngagement: true,
                    viewsOverExpected: 1.2,
                    isPunchingAboveWeight: true,
                    foundInHashtags: ['#fyp'],
                    hashtagAppearances: 5,
                    isCrossHashtagViral: false,
                    caption: `Reel caption ${r}...`,
                    captionHook: `Hook ${r}`,
                    spokenHook: `Spoken Hook ${r}`,
                    hasTranscript: true,
                    transcript: `This is the transcript for reel ${r}...`,
                    wordsPerMinute: 145.0,
                    detectedLanguage: 'en',
                    hashtags: ['#reel', '#insta'],
                    hashtagCount: 2,
                    views: 10000 + r * 1000,
                    likes: 500 + r * 50,
                    comments: 20 + r,
                    shares: 50 + r,
                    saves: 100 + r,
                    duration: 30.0 + r * 5,
                    captionLength: 50,
                    audioSongName: `Song ${r}`,
                    audioArtistName: `Artist ${r}`,
                    audioIsOriginal: r % 2 === 0,
                    postedAt: new Date(),
                    postDay: 'Friday',
                    performanceTier: r < 2 ? 'S' : 'A',
                    performanceScore: 9.0 - (r * 0.1)
                });
            }
            await prisma.reel.createMany({ data: reelsData });

            // 4.2 Top Hook
            await prisma.topHook.createMany({
                data: [
                    { performanceReportId: perfReport.id, hook: 'Stop doing this!', reelId: reelsData[0].id },
                    { performanceReportId: perfReport.id, hook: 'Secret revealed...', reelId: reelsData[1].id },
                ]
            });

            // 4.3 Top Caption
            await prisma.topCaption.createMany({
                data: [
                    { performanceReportId: perfReport.id, captionHook: 'Read caption for more', fullCaption: 'Full caption text here...', reelId: reelsData[0].id },
                ]
            });

            // 4.4 Top Keyword
            await prisma.topKeyword.createMany({
                data: [
                    { performanceReportId: perfReport.id, keyword: 'Strategy', count: 15, reels: [reelsData[0].id, reelsData[1].id] },
                    { performanceReportId: perfReport.id, keyword: 'Growth', count: 10, reels: [reelsData[2].id] },
                ]
            });

            // 4.5 Top Audio
            await prisma.topAudio.createMany({
                data: [
                    { performanceReportId: perfReport.id, songName: 'Trending Song 1', artistName: 'Artist A', isOriginal: false },
                    { performanceReportId: perfReport.id, songName: 'Original Audio', artistName: user.name!, isOriginal: true },
                ]
            });

            // 4.6 Comments
            await prisma.comment.createMany({
                data: [
                    { performanceReportId: perfReport.id, text: 'Great content!', reelId: reelsData[0].id, isFirstComment: true },
                    { performanceReportId: perfReport.id, text: 'Very helpful, thanks.', reelId: reelsData[0].id, isFirstComment: false },
                ]
            });

            // 4.7 Best Posting Time
            await prisma.bestPostingTime.createMany({
                data: [
                    { performanceReportId: perfReport.id, time: '18:00', posts: 10, avgViews: 15000, avgEngagement: 0.07 },
                    { performanceReportId: perfReport.id, time: '09:00', posts: 5, avgViews: 12000, avgEngagement: 0.05 },
                ]
            });

            // 4.8 Best Posting Day
            await prisma.bestPostingDay.createMany({
                data: [
                    { performanceReportId: perfReport.id, day: 'Monday', posts: 12, avgViews: 14000, avgEngagement: 0.06 },
                    { performanceReportId: perfReport.id, day: 'Friday', posts: 8, avgViews: 16000, avgEngagement: 0.08 },
                ]
            });

            // 4.9 Duration Performance
            await prisma.durationPerformance.createMany({
                data: [
                    { performanceReportId: perfReport.id, duration: '0-15s', posts: 5, avgViews: 8000, avgEngagement: 0.04 },
                    { performanceReportId: perfReport.id, duration: '15-30s', posts: 15, avgViews: 18000, avgEngagement: 0.09 },
                ]
            });
        }
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
