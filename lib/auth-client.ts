import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

// Export hooks for React components
export const { useSession, signIn, signOut, signUp } = authClient;
