import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Seeding subscription plans...");

    // 1. Define Plans
    const plans = [
        {
            name: "Silver",
            tier: 1,
            monthlyStellasGrant: 120,
            competitorAnalysisAccess: false,
            aiConsultantAccess: false,
            dailyAutoAnalysisEnabled: false,
            price: 2500, // $25.00
            providerProductId: "pdt_0NWyeKym8LDKoNKB9E7do"
        },
        {
            name: "Gold",
            tier: 2,
            monthlyStellasGrant: 220,
            competitorAnalysisAccess: true,
            aiConsultantAccess: false,
            dailyAutoAnalysisEnabled: true,
            price: 4500, // $45.00
            providerProductId: "pdt_0NXHnRHE2WZEePYoiQlyI"
        },
        {
            name: "Platinum",
            tier: 3,
            monthlyStellasGrant: 520,
            competitorAnalysisAccess: true,
            aiConsultantAccess: true, // "AI Consultant Access"
            dailyAutoAnalysisEnabled: true,
            price: 9900, // $99.00
            providerProductId: "pdt_0NXHnX4Wd2XdAz47FRiof"
        }
    ];

    for (const p of plans) {
        console.log(`Upserting plan: ${p.name}`);

        const plan = await prisma.plan.upsert({
            where: { name: p.name },
            update: {
                tier: p.tier,
                monthlyStellasGrant: p.monthlyStellasGrant,
                competitorAnalysisAccess: p.competitorAnalysisAccess,
                aiConsultantAccess: p.aiConsultantAccess,
                dailyAutoAnalysisEnabled: p.dailyAutoAnalysisEnabled,
            },
            create: {
                name: p.name,
                tier: p.tier,
                monthlyStellasGrant: p.monthlyStellasGrant,
                competitorAnalysisAccess: p.competitorAnalysisAccess,
                aiConsultantAccess: p.aiConsultantAccess,
                dailyAutoAnalysisEnabled: p.dailyAutoAnalysisEnabled,
            }
        });

        // Upsert Subscription Product
        console.log(`Upserting product for: ${p.name}`);
        const providerProductId = p.providerProductId;
        if (!providerProductId) {
            console.warn(`Skipping product for ${p.name} - no providerProductId`);
            continue;
        }

        await prisma.paymentProduct.upsert({
            where: { providerProductId: providerProductId },
            update: {
                planId: plan.id,
                price: p.price,
                currency: "USD",
                type: "SUBSCRIPTION",
                providerName: "dodo",
                billingPeriod: "MONTHLY"
            },
            create: {
                planId: plan.id,
                price: p.price,
                currency: "USD",
                type: "SUBSCRIPTION",
                providerName: "dodo",
                providerProductId: providerProductId,
                billingPeriod: "MONTHLY"
            }
        });
    }

    // 2. Define Stella Bundle (One-Time)
    // Small Bundle: 100 Stellas, $29
    const stellaBundle = {
        name: "Small Bundle",
        amount: 100,
        price: 2900,
        providerProductId: "pdt_0NWvdNgnGXCcADDk4MJDH"
    };

    console.log(`Upserting Stella Bundle: ${stellaBundle.name}`);

    // Create or update StellaBundle using findFirst because name is not unique in schema check?
    // Wait, let's look at schema again: `name` is just String, no @unique shown in snippet 287.
    // So we can't use upsert by name unless name is unique.
    // Let's use findFirst then create or update.

    let bundle = await prisma.stellaBundle.findFirst({
        where: { name: stellaBundle.name }
    });

    if (bundle) {
        bundle = await prisma.stellaBundle.update({
            where: { id: bundle.id },
            data: {
                stellaAmount: stellaBundle.amount
            }
        });
    } else {
        bundle = await prisma.stellaBundle.create({
            data: {
                name: stellaBundle.name,
                stellaAmount: stellaBundle.amount
            }
        });
    }

    await prisma.paymentProduct.upsert({
        where: { providerProductId: stellaBundle.providerProductId },
        update: {
            bundleId: bundle.id,
            price: stellaBundle.price,
            currency: "USD",
            type: "ONE_TIME",
            providerName: "dodo"
        },
        create: {
            bundleId: bundle.id,
            price: stellaBundle.price,
            currency: "USD",
            type: "ONE_TIME",
            providerName: "dodo",
            providerProductId: stellaBundle.providerProductId,
        }
    });

    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
