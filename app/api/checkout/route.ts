
import {DodoPayments} from "dodopayments";
import { NextResponse } from "next/server";


const client = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
    environment : "test_mode"
});

export async function POST(req: Request) {
    try {
        const { productId, quantity = 1, email, name, metadata } = await req.json();

        if (!productId || !email) {
            return NextResponse.json(
                { error: 'Missing required fields: productId and email are required' },
                { status: 400 }
            );
        }

        // console.log("pdtid", productId);
        // console.log("quantity", quantity);
        // console.log("email", email);
        // console.log("name", name);
        // console.log("metadata", metadata);
        // console.log("API Key exists:", !!process.env.DODO_PAYMENTS_API_KEY);
        // console.log("API Key length:", process.env.DODO_PAYMENTS_API_KEY?.length);
        // console.log("API Key first 10 chars:", process.env.DODO_PAYMENTS_API_KEY?.substring(0, 10));
        // console.log(`${process.env.BETTER_AUTH_URL}/dashboard/sucess`);

        const session = await client.checkoutSessions.create({
            product_cart: [{ product_id: productId, quantity }],
            customer: { email, name },
            metadata,
            return_url: process.env.DODO_PAYMENTS_RETURN_URL || `${process.env.BETTER_AUTH_URL}/dashboard/success`,
        });

        return NextResponse.json({
            checkout_url: session.checkout_url,
        });
    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout' },
            { status: 500 }
        );
    }
}
