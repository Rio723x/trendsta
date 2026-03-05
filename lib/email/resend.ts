import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Use a verified domain for production, or onboarding@resend.dev for testing if no domain is verified yet.
// If you verified your domain (e.g., trendsta.com), replace this with "no-reply@trendsta.com" or similar.
const FROM_EMAIL = "info@trendsta.in";

export async function sendWelcomeEmail(to: string, name: string) {
    const { data, error } = await resend.emails.send({
        from: `Trendsta <${FROM_EMAIL}>`,
        to: [to],
        subject: "Welcome to Trendsta!",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2>Welcome to Trendsta, ${name}! 🎉</h2>
                <p>We're absolutely thrilled to have you on board.</p>
                <p>Trendsta is your companion to discover viral trends, optimize your hooks, and rapidly grow your content strategy.</p>
                <div style="margin: 30px 0;">
                    <a href="${process.env.BETTER_AUTH_URL}/dashboard" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                        Go to your Dashboard
                    </a>
                </div>
                <p>Best regards,<br/>The Trendsta Team</p>
            </div>
        `,
    });

    if (error) {
        console.error("Failed to send welcome email:", error);
        return { success: false, error };
    }

    console.log("Welcome email sent:", data);
    return { success: true, data };
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
    const { data, error } = await resend.emails.send({
        from: `Trendsta <${FROM_EMAIL}>`,
        to: [to],
        subject: "Reset your Trendsta password",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2>Password Reset Request</h2>
                <p>We received a request to reset your password for your Trendsta account.</p>
                <p>Click the button below to choose a new password. This link will expire soon.</p>
                <div style="margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                        Reset Password
                    </a>
                </div>
                <p>If you didn't request this, you can safely ignore this email.</p>
                <p style="font-size: 12px; color: #666; margin-top: 40px;">
                    If the button doesn't work, copy and paste this link into your browser:<br/>
                    <a href="${resetLink}">${resetLink}</a>
                </p>
            </div>
        `,
    });

    if (error) {
        console.error("Failed to send password reset email:", error);
        return { success: false, error };
    }

    console.log("Password reset email sent:", data);
    return { success: true, data };
}
