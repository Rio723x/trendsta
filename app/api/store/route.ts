import { auth } from "@/lib/auth"
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Safe to proceed (You have session.user)
    console.log("User ID:", session.user);

    return NextResponse.json({ success: true });

}