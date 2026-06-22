
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import GoogleProvider from "@/context/GoogleProvider";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "LifeLessons — Preserve & Share Personal Wisdom",
  description:
    "A platform to create, store, and share meaningful life lessons, personal growth insights, and wisdom gathered over time.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen flex flex-col font-sans">
        <GoogleProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#1f2937",
                  color: "#f3f4f6",
                  border: "1px solid #374151",
                },
                success: { iconTheme: { primary: "#8b5cf6", secondary: "#f3f4f6" } },
                error: { iconTheme: { primary: "#ef4444", secondary: "#f3f4f6" } },
              }}
            />
          </AuthProvider>
        </GoogleProvider>
      </body>
    </html>
  );
}
