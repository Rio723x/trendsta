-- CreateEnum
CREATE TYPE "TweetCategory" AS ENUM ('LATEST', 'TOP');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Research" (
    "id" TEXT NOT NULL,
    "socialAccountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Research_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScriptIdea" (
    "id" TEXT NOT NULL,
    "researchId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "topicTitle" TEXT NOT NULL,
    "scriptTitle" TEXT NOT NULL,
    "viralPotentialScore" DOUBLE PRECISION NOT NULL,
    "estimatedDuration" TEXT NOT NULL,
    "fullText" TEXT NOT NULL,
    "scriptWordCount" INTEGER NOT NULL,
    "scriptHook" TEXT NOT NULL,
    "scriptBuildup" TEXT NOT NULL,
    "scriptValue" TEXT NOT NULL,
    "scriptCta" TEXT NOT NULL,
    "captionFull" TEXT NOT NULL,
    "captionFirstLine" TEXT NOT NULL,
    "hashtagsPrimary" TEXT NOT NULL,
    "hashtagsNiche" TEXT NOT NULL,
    "hashtagsTrending" TEXT NOT NULL,
    "hashtagsAll" TEXT NOT NULL,
    "hashtagsCount" INTEGER NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "emotionalTrigger" TEXT NOT NULL,
    "contentGapAddressed" TEXT NOT NULL,
    "whyThisWorks" TEXT NOT NULL,
    "competitorReference" TEXT NOT NULL,
    "generatedAt" TEXT NOT NULL,

    CONSTRAINT "ScriptIdea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchSummary" (
    "id" TEXT NOT NULL,
    "researchId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "instagramInsights" TEXT NOT NULL,
    "twitterInsights" TEXT NOT NULL,
    "competitorInsights" TEXT NOT NULL,
    "viralTriggers" TEXT NOT NULL,
    "contentGap" TEXT NOT NULL,
    "postingTimes" TEXT NOT NULL,
    "hookFormula" TEXT NOT NULL,
    "instagramSummaryResearch" TEXT NOT NULL,
    "generatedAt" TEXT NOT NULL,

    CONSTRAINT "ResearchSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tweet" (
    "id" TEXT NOT NULL,
    "researchId" TEXT NOT NULL,
    "category" "TweetCategory" NOT NULL,
    "url" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "hook" TEXT,
    "wordCount" INTEGER,
    "charCount" INTEGER,
    "hasQuestion" BOOLEAN,
    "hasEmoji" BOOLEAN,
    "hasNumbers" BOOLEAN,
    "contentFormat" TEXT,
    "author" TEXT NOT NULL,
    "authorName" TEXT,
    "authorFollowers" INTEGER,
    "isVerified" BOOLEAN,
    "isBlueVerified" BOOLEAN,
    "authorProfilePic" TEXT,
    "likes" INTEGER NOT NULL,
    "retweets" INTEGER NOT NULL,
    "replies" INTEGER NOT NULL,
    "quotes" INTEGER,
    "bookmarks" INTEGER,
    "views" INTEGER,
    "totalEngagement" INTEGER,
    "engagementRate" DOUBLE PRECISION,
    "viralScore" DOUBLE PRECISION,
    "postedAt" TEXT,
    "postDate" TEXT,
    "ageHours" DOUBLE PRECISION,
    "ageDays" DOUBLE PRECISION,
    "postHour" INTEGER,
    "postDay" TEXT,
    "language" TEXT,
    "hashtags" TEXT[],
    "mentions" TEXT[],
    "mediaType" TEXT,
    "mediaUrl" TEXT,
    "hasMedia" BOOLEAN,
    "hasLinks" BOOLEAN,
    "linkedDomains" JSONB,
    "isReply" BOOLEAN,
    "isPinned" BOOLEAN,
    "rank" INTEGER,
    "hasEarlyTraction" BOOLEAN,
    "isThread" BOOLEAN,

    CONSTRAINT "Tweet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceReport" (
    "id" TEXT NOT NULL,
    "researchId" TEXT NOT NULL,
    "profileUsername" TEXT,
    "profileFullName" TEXT,
    "profileTotalReels" INTEGER,
    "totalViews" INTEGER,
    "totalLikes" INTEGER,
    "totalComments" INTEGER,
    "totalShares" INTEGER,
    "totalSaves" INTEGER,
    "avgViews" DOUBLE PRECISION,
    "avgLikes" DOUBLE PRECISION,
    "avgComments" DOUBLE PRECISION,
    "avgDuration" DOUBLE PRECISION,
    "avgEngagement" DOUBLE PRECISION,
    "transcriptCoverage" DOUBLE PRECISION,
    "avgWPM" DOUBLE PRECISION,
    "commentsTotal" INTEGER,
    "commentsUniqueCommenters" INTEGER,
    "benchmarkViewsToBeat" INTEGER,
    "benchmarkLikesToBeat" INTEGER,
    "benchmarkEngagementToBeat" DOUBLE PRECISION,
    "benchmarkDurationSweetSpot" DOUBLE PRECISION,
    "benchmarkSpeakingPace" DOUBLE PRECISION,
    "benchmarkTopPerformerScore" DOUBLE PRECISION,
    "topHashtags" JSONB,
    "insights" TEXT[],

    CONSTRAINT "PerformanceReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reel" (
    "id" TEXT NOT NULL,
    "performanceReportId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "rank" INTEGER,
    "velocityScore" DOUBLE PRECISION,
    "finalScore" DOUBLE PRECISION,
    "ageHours" DOUBLE PRECISION,
    "ageLabel" TEXT,
    "engagementRate" DOUBLE PRECISION,
    "commentToLikeRatio" DOUBLE PRECISION,
    "isQualityEngagement" BOOLEAN,
    "viewsOverExpected" DOUBLE PRECISION,
    "isPunchingAboveWeight" BOOLEAN,
    "foundInHashtags" JSONB,
    "hashtagAppearances" INTEGER,
    "isCrossHashtagViral" BOOLEAN,
    "caption" TEXT,
    "captionHook" TEXT,
    "spokenHook" TEXT,
    "hasTranscript" BOOLEAN,
    "transcript" TEXT,
    "wordsPerMinute" DOUBLE PRECISION,
    "detectedLanguage" TEXT,
    "hashtags" JSONB,
    "hashtagCount" INTEGER,
    "views" INTEGER,
    "likes" INTEGER,
    "comments" INTEGER,
    "shares" INTEGER,
    "saves" INTEGER,
    "duration" DOUBLE PRECISION,
    "captionLength" INTEGER,
    "audioSongName" TEXT,
    "audioArtistName" TEXT,
    "audioIsOriginal" BOOLEAN,
    "postedAt" TEXT,
    "postDay" TEXT,
    "performanceTier" TEXT,
    "performanceScore" DOUBLE PRECISION,

    CONSTRAINT "Reel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopHook" (
    "id" TEXT NOT NULL,
    "performanceReportId" TEXT NOT NULL,
    "hook" TEXT NOT NULL,
    "reelId" TEXT NOT NULL,

    CONSTRAINT "TopHook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopCaption" (
    "id" TEXT NOT NULL,
    "performanceReportId" TEXT NOT NULL,
    "captionHook" TEXT NOT NULL,
    "fullCaption" TEXT NOT NULL,
    "reelId" TEXT NOT NULL,

    CONSTRAINT "TopCaption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopKeyword" (
    "id" TEXT NOT NULL,
    "performanceReportId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "reels" TEXT[],

    CONSTRAINT "TopKeyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopAudio" (
    "id" TEXT NOT NULL,
    "performanceReportId" TEXT NOT NULL,
    "songName" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "isOriginal" BOOLEAN NOT NULL,

    CONSTRAINT "TopAudio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "performanceReportId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "reelId" TEXT NOT NULL,
    "isFirstComment" BOOLEAN,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BestPostingTime" (
    "id" TEXT NOT NULL,
    "performanceReportId" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "posts" INTEGER NOT NULL,
    "avgViews" DOUBLE PRECISION NOT NULL,
    "avgEngagement" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BestPostingTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BestPostingDay" (
    "id" TEXT NOT NULL,
    "performanceReportId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "posts" INTEGER NOT NULL,
    "avgViews" DOUBLE PRECISION NOT NULL,
    "avgEngagement" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BestPostingDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DurationPerformance" (
    "id" TEXT NOT NULL,
    "performanceReportId" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "posts" INTEGER NOT NULL,
    "avgViews" DOUBLE PRECISION NOT NULL,
    "avgEngagement" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DurationPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PerformanceReport_researchId_key" ON "PerformanceReport"("researchId");

-- AddForeignKey
ALTER TABLE "SocialAccount" ADD CONSTRAINT "SocialAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Research" ADD CONSTRAINT "Research_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "SocialAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScriptIdea" ADD CONSTRAINT "ScriptIdea_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "Research"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchSummary" ADD CONSTRAINT "ResearchSummary_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "Research"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "Research"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceReport" ADD CONSTRAINT "PerformanceReport_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "Research"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reel" ADD CONSTRAINT "Reel_performanceReportId_fkey" FOREIGN KEY ("performanceReportId") REFERENCES "PerformanceReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopHook" ADD CONSTRAINT "TopHook_performanceReportId_fkey" FOREIGN KEY ("performanceReportId") REFERENCES "PerformanceReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopCaption" ADD CONSTRAINT "TopCaption_performanceReportId_fkey" FOREIGN KEY ("performanceReportId") REFERENCES "PerformanceReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopKeyword" ADD CONSTRAINT "TopKeyword_performanceReportId_fkey" FOREIGN KEY ("performanceReportId") REFERENCES "PerformanceReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopAudio" ADD CONSTRAINT "TopAudio_performanceReportId_fkey" FOREIGN KEY ("performanceReportId") REFERENCES "PerformanceReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_performanceReportId_fkey" FOREIGN KEY ("performanceReportId") REFERENCES "PerformanceReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BestPostingTime" ADD CONSTRAINT "BestPostingTime_performanceReportId_fkey" FOREIGN KEY ("performanceReportId") REFERENCES "PerformanceReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BestPostingDay" ADD CONSTRAINT "BestPostingDay_performanceReportId_fkey" FOREIGN KEY ("performanceReportId") REFERENCES "PerformanceReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DurationPerformance" ADD CONSTRAINT "DurationPerformance_performanceReportId_fkey" FOREIGN KEY ("performanceReportId") REFERENCES "PerformanceReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
