import { createAuthClient } from "better-auth/react";
// import { dodopaymentsClient } from "@dodopayments/better-auth";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  // plugins: [dodopaymentsClient()],
});
// Export hooks for React components
export const { useSession, signIn, signOut, signUp } = authClient;

