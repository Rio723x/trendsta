import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../generated/prisma";
import path from "path";
import fs from "fs";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    const guestEmail = process.env.GUEST_EMAIL;
    console.log(guestEmail);
        if (!guestEmail) {
            throw new Error("GUEST_EMAIL env var not set");
        }
    
        console.log(`Seeding guest user: ${guestEmail}`);
    
        // 1. Upsert User
        const user = await prisma.user.upsert({
            where: { email: guestEmail },
            update: {},
            create: {
                email: guestEmail,
                name: "Guest User",
                emailVerified: true,
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
            },
        });
    
        console.log(`User ID: ${user.id}`);
    
        // 2. Upsert Social Account
        const username = "chatgptricks";
        const existingSocial = await prisma.socialAccount.findFirst({
            where: { userId: user.id, username: username }
        });
    
        let socialAccountId = existingSocial?.id;
    
        if (!existingSocial) {
            const newSocial = await prisma.socialAccount.create({
                data: {
                    userId: user.id,
                    username: username
                }
            });
            socialAccountId = newSocial.id;
            console.log(`Created SocialAccount: ${username}`);
        } else {
            console.log(`Found SocialAccount: ${username}`);
        }
    
        if (!socialAccountId) throw new Error("Failed to get SocialAccountId");
    
        // 3. Read Data
        const dataPath = path.join(process.cwd(), 'guest_data.json');
        console.log(`Reading data from: ${dataPath}`);
    
        if (!fs.existsSync(dataPath)) {
            throw new Error(`Data file not found at ${dataPath}`);
        }
    
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const jsonData = JSON.parse(rawData);
    
        // The JSON is an array, take the first item
        const guestData = Array.isArray(jsonData) ? jsonData[0] : jsonData;
    
        // 4. Create Research
        // Clear existing research for this account to avoid duplicates/confusion
        console.log("Clearing old research...");
        await prisma.research.deleteMany({
            where: { socialAccountId: socialAccountId }
        });
    
        console.log("Creating new research...");
        const research = await prisma.research.create({
            data: {
                socialAccountId: socialAccountId,
                // Create related data inline
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
    
        console.log(`Successfully created Research Object! ID: ${research.id}`);
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
