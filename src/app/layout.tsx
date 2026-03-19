import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/components/UserProvider";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import prisma from "@/lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Iron Tide — World of Sea Battle Guild",
  description: "Rule the seas. The Iron Tide is a World of Sea Battle guild forged in iron, bound by brotherhood, and feared across every ocean.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "The Iron Tide — World of Sea Battle Guild",
    description: "Born from cannon fire and forged in salt water. We don't ask for the seas — we take them.",
    images: [{ url: "/og-image.png", width: 1024, height: 1024, alt: "The Iron Tide" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Iron Tide — World of Sea Battle Guild",
    description: "Born from cannon fire and forged in salt water. We don't ask for the seas — we take them.",
    images: ["/og-image.png"],
  },
};

async function getUser() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { username: null, rank: null, isAuthenticated: false };

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      select: { username: true, rank: true },
    });

    return {
      username: dbUser?.username ?? null,
      rank: dbUser?.rank ?? null,
      isAuthenticated: true,
    };
  } catch {
    return { username: null, rank: null, isAuthenticated: false };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider user={user}>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
