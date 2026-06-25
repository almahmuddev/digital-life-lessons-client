"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

const FALLBACK_CLIENT_ID = "000000000000-placeholder.apps.googleusercontent.com";

export default function GoogleProvider({ children }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || FALLBACK_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
}
