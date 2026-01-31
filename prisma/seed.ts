import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";
import path from "path";
import fs from "fs";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Starting database seeding...\n");

    // ============================================
    // 1. SEED SUBSCRIPTION PLANS
    // ============================================
    // console.log("📋 Seeding subscription plans...");

    // const plans = [
    //     {
    //         name: "Silver",
    //         tier: 1,
    //         monthlyStellasGrant: 120,
    //         competitorAnalysisAccess: false,
    //         aiConsultantAccess: false,
    //         dailyAutoAnalysisEnabled: false,
    //         price: 2500, // $25.00
    //         providerProductId: "pdt_0NWyeKym8LDKoNKB9E7do"
    //     },
    //     {
    //         name: "Gold",
    //         tier: 2,
    //         monthlyStellasGrant: 220,
    //         competitorAnalysisAccess: true,
    //         aiConsultantAccess: false,
    //         dailyAutoAnalysisEnabled: true,
    //         price: 4500, // $45.00
    //         providerProductId: "pdt_0NXHnRHE2WZEePYoiQlyI"
    //     },
    //     {
    //         name: "Platinum",
    //         tier: 3,
    //         monthlyStellasGrant: 520,
    //         competitorAnalysisAccess: true,
    //         aiConsultantAccess: true, // "AI Consultant Access"
    //         dailyAutoAnalysisEnabled: true,
    //         price: 9900, // $99.00
    //         providerProductId: "pdt_0NXHnX4Wd2XdAz47FRiof"
    //     }
    // ];

    // for (const p of plans) {
    //     console.log(`  ↳ Upserting plan: ${p.name}`);

    //     const plan = await prisma.plan.upsert({
    //         where: { name: p.name },
    //         update: {
    //             tier: p.tier,
    //             monthlyStellasGrant: p.monthlyStellasGrant,
    //             competitorAnalysisAccess: p.competitorAnalysisAccess,
    //             aiConsultantAccess: p.aiConsultantAccess,
    //             dailyAutoAnalysisEnabled: p.dailyAutoAnalysisEnabled,
    //         },
    //         create: {
    //             name: p.name,
    //             tier: p.tier,
    //             monthlyStellasGrant: p.monthlyStellasGrant,
    //             competitorAnalysisAccess: p.competitorAnalysisAccess,
    //             aiConsultantAccess: p.aiConsultantAccess,
    //             dailyAutoAnalysisEnabled: p.dailyAutoAnalysisEnabled,
    //         }
    //     });

    //     // Upsert Subscription Product
    //     console.log(`  ↳ Upserting product for: ${p.name}`);
    //     const providerProductId = p.providerProductId;
    //     if (!providerProductId) {
    //         console.warn(`  ⚠️  Skipping product for ${p.name} - no providerProductId`);
    //         continue;
    //     }

    //     await prisma.paymentProduct.upsert({
    //         where: { providerProductId: providerProductId },
    //         update: {
    //             planId: plan.id,
    //             price: p.price,
    //             currency: "USD",
    //             type: "SUBSCRIPTION",
    //             providerName: "dodo",
    //             billingPeriod: "MONTHLY"
    //         },
    //         create: {
    //             planId: plan.id,
    //             price: p.price,
    //             currency: "USD",
    //             type: "SUBSCRIPTION",
    //             providerName: "dodo",
    //             providerProductId: providerProductId,
    //             billingPeriod: "MONTHLY"
    //         }
    //     });
    // }

    // // ============================================
    // // 2. SEED STELLA BUNDLE (ONE-TIME)
    // // ============================================
    // console.log("\n💎 Seeding Stella Bundle...");

    // const stellaBundle = {
    //     name: "Small Bundle",
    //     amount: 100,
    //     price: 2900,
    //     providerProductId: "pdt_0NWvdNgnGXCcADDk4MJDH"
    // };

    // console.log(`  ↳ Upserting Stella Bundle: ${stellaBundle.name}`);

    // let bundle = await prisma.stellaBundle.findFirst({
    //     where: { name: stellaBundle.name }
    // });

    // if (bundle) {
    //     bundle = await prisma.stellaBundle.update({
    //         where: { id: bundle.id },
    //         data: {
    //             stellaAmount: stellaBundle.amount
    //         }
    //     });
    // } else {
    //     bundle = await prisma.stellaBundle.create({
    //         data: {
    //             name: stellaBundle.name,
    //             stellaAmount: stellaBundle.amount
    //         }
    //     });
    // }

    // await prisma.paymentProduct.upsert({
    //     where: { providerProductId: stellaBundle.providerProductId },
    //     update: {
    //         bundleId: bundle.id,
    //         price: stellaBundle.price,
    //         currency: "USD",
    //         type: "ONE_TIME",
    //         providerName: "dodo"
    //     },
    //     create: {
    //         bundleId: bundle.id,
    //         price: stellaBundle.price,
    //         currency: "USD",
    //         type: "ONE_TIME",
    //         providerName: "dodo",
    //         providerProductId: stellaBundle.providerProductId,
    //     }
    // });

    // ============================================
    // 3. SEED GUEST USER DATA
    // ============================================
    console.log("\n👤 Seeding guest user data...");

    //const guestEmail = process.env.GUEST_EMAIL;
    const userId = "c38138e6-d4d3-4790-aafc-bc2428c6fbbf";
    if (!userId) {
        console.warn("  ⚠️  GUEST_EMAIL not set in .env, skipping guest data seeding");
    } else {
        console.log(`  ↳ Looking for guest user: ${userId}`);

        // Upsert guest user (create if doesn't exist)
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        //  console.log(`  ✓ Guest user ready: ${guestUser.name || guestUser.email}`);

        // Upsert social account for guest
        //const guestUsername = "100xengineers"; // Default guest username
        //console.log(`  ↳ Upserting social account: @${guestUsername}`);

        let socialAccount = await prisma.socialAccount.findFirst({
            where: { userId: user!.id }
        });

        // if (socialAccount) {
        //     // Update existing social account
        //     socialAccount = await prisma.socialAccount.update({
        //         where: { id: socialAccount.id },
        //     });

        // Create new social account
        // socialAccount = await prisma.socialAccount.create({
        //     data: {
        //         userId: guestUser.id,
        //     }
        // });


        console.log(`✓ Social account ready: ${socialAccount!.id}`);

        // Read guest data from JSON file
        const dataPath = path.join(process.cwd(), 'guest_data.json');
        console.log(`↳ Reading data from: ${dataPath}`);

        if (!fs.existsSync(dataPath)) {
            console.warn(`  ⚠️  Data file not found at ${dataPath}, skipping research data`);
        } else {
            const rawData = fs.readFileSync(dataPath, 'utf-8');
            const jsonData = JSON.parse(rawData);
            const guestData = Array.isArray(jsonData) ? jsonData[0] : jsonData;

            // Clear existing research for this account
            console.log("  ↳ Clearing old research...");
            await prisma.research.deleteMany({
                where: { socialAccountId: socialAccount!.id }
            });

            // Inject Context 1-liners
            const USER_CONTEXT = "Creator 100xengineers (Sanidhya Tulsinandan) focuses on AI & Tech tutorials, averaging 200k views/reel with a viral rate of 40%.";
            const COMPETITOR_CONTEXT = "Competitors like trakin.ai and nivedan.ai leverage transcript-based hooks and storytelling to drive high engagement in the AI niche.";
            const NICHE_CONTEXT = "The AI & Tech niche favors rapid tutorials and updates on new tools, with high demand for practical application advice.";
            const TWITTER_CONTEXT = "Twitter trends highlight AI agent capabilities and security concerns, with active discussions on model performance.";

            if (guestData.user_research_json) {
                guestData.user_research_json.user_context = USER_CONTEXT;
            }
            if (guestData.competitor_research_json) {
                guestData.competitor_research_json.competitor_context = COMPETITOR_CONTEXT;
            }
            // Ensure niche_research_json exists
            if (!guestData.niche_research_json) guestData.niche_research_json = {};
            guestData.niche_research_json.niche_context = NICHE_CONTEXT;

            if (guestData.twitterLatest_research_json) {
                guestData.twitterLatest_research_json.twitter_context = TWITTER_CONTEXT;
            } else {
                // If the key doesn't exist (e.g. data structure issue), ensure we create it or attach to what's available
                guestData.twitterLatest_research_json = { twitter_context: TWITTER_CONTEXT };
            }

            // Create new research with all data
            console.log("  ↳ Creating new research...");
            const research = await prisma.research.create({
                data: {
                    socialAccountId: socialAccount!.id,
                    scriptSuggestions: {
                        create: {
                            scripts: guestData.script_suggestion?.scripts || []
                        }
                    },
                    overallStrategy: {
                        create: {
                            data: guestData.overall_strategy || {}
                        }
                    },
                    userResearch: {
                        create: {
                            data: guestData.user_research_json || {}
                        }
                    },
                    competitorResearch: {
                        create: {
                            data: guestData.competitor_research_json || {}
                        }
                    },
                    nicheResearch: {
                        create: {
                            data: guestData.niche_research_json || {}
                        }
                    },
                    twitterResearch: {
                        create: {
                            latestData: guestData.twitterLatest_research_json || {},
                            topData: guestData.twitterTop_research_json || {}
                        }
                    }
                }
            });

            console.log(`  ✓ Successfully created research! ID: ${research.id}`);
        }
    }
}

console.log("\n✅ Seeding complete!");

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
