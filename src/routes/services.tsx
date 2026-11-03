import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Tilt } from "@/components/Tilt";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Grooming Packages — Fur&Fern" },
      { name: "description", content: "Choose from Splash, Spa and Royal grooming packages." },
      { property: "og:title", content: "Grooming Packages — Fur&Fern" },
      { property: "og:description", content: "Choose from Splash, Spa and Royal grooming packages." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Services,
});

const plans = [
  { n: "Splash", p: 799, e: "🛁", c: "bg-card", items: ["Bubble bath", "Blow dry", "Ear clean"] },
  { n: "Spa", p: 1499, e: "✨", c: "bg-sun", items: ["Everything in Splash", "Breed haircut", "Pawdicure", "Teeth sparkle"] },
  { n: "Royal", p: 2499, e: "👑", c: "bg-primary text-primary-foreground", items: ["Everything in Spa", "Health scan", "Aromatherapy", "Photo shoot"] },
];

function Services() {
  return (
    <div className="min-h-screen bg-hero">
      <SiteNav />
      <div className="mx-auto max-w-6xl px-6 pt-36 pb-24">
        <h1 className="text-6xl md:text-7xl font-black text-center">Pick a pamper.</h1>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {plans.map((p) => (
            <Tilt key={p.n}>
              <div className={`rounded-3xl p-8 shadow-3d ${p.c}`}>
                <div className="text-6xl" style={{ transform: "translateZ(60px)" }}>{p.e}</div>
                <h2 className="mt-6 text-3xl font-black">{p.n}</h2>
                <p className="mt-2 font-display text-5xl font-black">₹{p.p}</p>
                <ul className="mt-6 space-y-2">
                  {p.items.map((i) => <li key={i} className="flex gap-2"><Check className="h-5 w-5" />{i}</li>)}
                </ul>
                <Link to="/dashboard" className="mt-8 block rounded-full bg-accent py-3 text-center font-semibold text-accent-foreground">Book {p.n}</Link>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </div>
  );
}
