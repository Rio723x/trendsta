import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";
import path from "path";
import fs from "fs";
import { STELLA_BUNDLES } from "../lib/constants/products";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    // ============================================
    // 2. SEED STELLA BUNDLES (ONE-TIME)
    // ============================================
    console.log("\n💎 Seeding Stella Bundles...");

    const bundles = STELLA_BUNDLES.map(b => ({
        name: b.name,
        stellaAmount: b.stellas,
        price: b.price,
        providerProductId: b.id
    }));

    for (const b of bundles) {
        console.log(`  ↳ Upserting Stella Bundle: ${b.name}`);

        let bundle = await prisma.stellaBundle.findFirst({
            where: { name: b.name }
        });

        if (bundle) {
            bundle = await prisma.stellaBundle.update({
                where: { id: bundle.id },
                data: {
                    stellaAmount: b.stellaAmount,
                    isActive: true
                }
            });
        } else {
            bundle = await prisma.stellaBundle.create({
                data: {
                    name: b.name,
                    stellaAmount: b.stellaAmount,
                    isActive: true
                }
            });
        }

        await prisma.paymentProduct.upsert({
            where: { providerProductId: b.providerProductId },
            update: {
                bundleId: bundle.id,
                price: b.price,
                currency: "USD",
                type: "ONE_TIME",
                providerName: "dodo"
            },
            create: {
                bundleId: bundle.id,
                price: b.price,
                currency: "USD",
                type: "ONE_TIME",
                providerName: "dodo",
                providerProductId: b.providerProductId,
            }
        });
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
