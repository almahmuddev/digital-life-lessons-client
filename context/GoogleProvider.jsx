"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

// Always provide SOME client ID to GoogleOAuthProvider so that
// useGoogleLogin() never throws during prerendering/build if the
// real env var hasn't been set yet. The button itself checks for
// the real env var before attempting an actual login.
const FALLBACK_CLIENT_ID = "000000000000-placeholder.apps.googleusercontent.com";

export default function GoogleProvider({ children }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || FALLBACK_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
}
