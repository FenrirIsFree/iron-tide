"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createBrowserClient } from "@/lib/supabase";

const features = [
  {
    icon: "🗺️",
    title: "Fleet Tracker",
    desc: "Track your ships, weapons, and loadouts in one place.",
  },
  {
    icon: "📦",
    title: "Resource Inventory",
    desc: "Monitor your materials, currencies, and supplies.",
  },
  {
    icon: "👥",
    title: "Guild Roster",
    desc: "See all members and their fleets at a glance.",
  },
  {
    icon: "📖",
    title: "Ship Database",
    desc: "Complete WoSB ship and weapon reference guide.",
  },
];

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setLoggedIn(true);
    });
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="pt-32 pb-20 px-4 text-center">
          <h1 className="text-5xl sm:text-7xl font-bold text-accent tracking-tight">
            ⚓ THE IRON TIDE
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-foreground-secondary">
            A World of Sea Battle Guild
          </p>
          <p className="mt-6 max-w-2xl mx-auto text-foreground-secondary leading-relaxed">
            Born from cannon fire and forged in salt water. We don&apos;t ask for the seas —
            we take them. The Iron Tide rises, and everything in its wake bends or breaks.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {loggedIn ? (
              <Link
                href="/dashboard"
                className="px-8 py-3 text-lg font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-8 py-3 text-lg font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Member Login
                </Link>
                <Link
                  href="/signup"
                  className="px-8 py-3 text-lg font-semibold text-accent border-2 border-accent rounded-lg hover:bg-accent hover:text-background transition-colors"
                >
                  Join The Crew
                </Link>
              </>
            )}
          </div>
        </section>

        {/* About */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12">
              Who We Are
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "⚔️",
                  title: "Domination",
                  text: "We control trade routes, crush rivals, and hold the most feared fleet on the server.",
                },
                {
                  icon: "💰",
                  title: "Trade & Wealth",
                  text: "Strategic resource management and trade networks that keep our war machine funded and our crews supplied.",
                },
                {
                  icon: "🤝",
                  title: "Brotherhood",
                  text: "Loyalty above all. Every member of The Iron Tide is family — we sail together, we fight together.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-surface border border-surface-border rounded-xl p-6 text-center"
                >
                  <div className="text-4xl mb-4">{card.icon}</div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{card.title}</h3>
                  <p className="text-foreground-secondary text-sm leading-relaxed">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 bg-surface">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12">
              Member Tools
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="bg-background border border-surface-border rounded-xl p-6"
                >
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{f.title}</h3>
                  <p className="text-foreground-secondary text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
