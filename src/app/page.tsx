import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const stats = [
  { number: "62", label: "Ships Cataloged", icon: "🚢" },
  { number: "42", label: "Weapons", icon: "💣" },
  { number: "6", label: "Factions", icon: "⚔️" },
  { number: "7", label: "Guild Ranks", icon: "🎖️" },
];

const ranks = [
  { title: "Founder", desc: "The one who lit the forge" },
  { title: "Admiral", desc: "Commands the entire fleet" },
  { title: "Commodore", desc: "Leads squadrons into battle" },
  { title: "Officer", desc: "Trusted strategist and veteran" },
  { title: "Midshipman", desc: "Proven sailor, rising fast" },
  { title: "Sailor", desc: "Full member of the crew" },
  { title: "Cabin Boy", desc: "Fresh recruit, eager to prove" },
];

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
            <Link
              href="/signup"
              className="px-8 py-3 text-lg font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors"
            >
              Join The Crew
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 text-lg font-semibold text-accent border-2 border-accent rounded-lg hover:bg-accent hover:text-background transition-colors"
            >
              Member Login
            </Link>
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
                  text: "We control trade routes, crush rivals, and hold the most feared fleet on every server.",
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

        {/* Fleet Stats */}
        <section className="py-20 px-4 bg-surface">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12">
              Fleet Intelligence
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="p-6">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-4xl sm:text-5xl font-bold text-accent">{s.number}</div>
                  <div className="mt-2 text-foreground-secondary text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ranks */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12">
              Guild Ranks
            </h2>
            <ol className="space-y-3">
              {ranks.map((rank, i) => (
                <li
                  key={rank.title}
                  className="flex items-center gap-4 bg-surface border border-surface-border rounded-lg px-5 py-4"
                >
                  <span className="text-accent font-bold text-lg w-8 shrink-0">
                    {i + 1}.
                  </span>
                  <div className="text-left">
                    <span className="font-semibold text-foreground">{rank.title}</span>
                    <span className="text-foreground-secondary text-sm ml-2">— {rank.desc}</span>
                  </div>
                </li>
              ))}
            </ol>
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
