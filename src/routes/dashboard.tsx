import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Droplets, Scissors, Heart, Plus, Check } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Tilt } from "@/components/Tilt";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Pet Dashboard — Fur&Fern" },
      { name: "description", content: "Track grooming progress, bookings and pet health." },
      { property: "og:title", content: "Pet Dashboard — Fur&Fern" },
      { property: "og:description", content: "Track grooming progress, bookings and pet health." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const pets = [
  { name: "Biscuit", breed: "Goldendoodle", e: "🐶", coat: 92, mood: 98 },
  { name: "Miso", breed: "Persian cat", e: "🐱", coat: 78, mood: 85 },
  { name: "Pepper", breed: "Beagle", e: "🐕", coat: 64, mood: 90 },
];
const steps = ["Check-in", "Bubble bath", "Blow dry", "Haircut", "Pawdicure", "Ready!"];
const weekly = [40, 65, 52, 80, 70, 95, 60];

function Ring({ v, label }: { v: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-24 rounded-full" style={{ background: `conic-gradient(var(--coral) ${v * 3.6}deg, var(--muted) 0)` }}>
        <div className="absolute inset-2 flex items-center justify-center rounded-full bg-card font-display text-2xl font-black">{v}</div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Dashboard() {
  const [sel, setSel] = useState(0);
  const [step, setStep] = useState(3);
  const [bookings, setBookings] = useState([
    { d: "Nov 06", s: "Spa package", p: "Biscuit" },
    { d: "Nov 12", s: "Pawdicure", p: "Miso" },
  ]);
  const pet = pets[sel];
  return (
    <div className="min-h-screen bg-hero">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-6 pt-32 pb-16">
        <h1 className="text-5xl font-black">Hello, pet parent 👋</h1>
        <div className="mt-6 flex gap-3">
          {pets.map((p, i) => (
            <button key={p.name} onClick={() => setSel(i)} className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-medium transition ${i === sel ? "bg-primary text-primary-foreground shadow-3d -translate-y-1" : "bg-card"}`}>
              <span className="text-xl">{p.e}</span>{p.name}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Tilt max={8}>
            <div className="rounded-3xl bg-primary p-8 text-primary-foreground shadow-3d">
              <div className="text-8xl animate-floaty" style={{ transform: "translateZ(70px)" }}>{pet.e}</div>
              <h2 className="mt-4 text-4xl font-black">{pet.name}</h2>
              <p className="opacity-70">{pet.breed}</p>
              <div className="mt-6 flex gap-3 text-sm">
                <span className="rounded-full bg-primary-foreground/15 px-3 py-1">Vaccinated</span>
                <span className="rounded-full bg-primary-foreground/15 px-3 py-1">Gold member</span>
              </div>
            </div>
          </Tilt>

          <div className="rounded-3xl bg-card p-8 shadow-3d lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Live grooming tracker</h3>
              <button onClick={() => setStep((s) => (s + 1) % steps.length)} className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">Next step</button>
            </div>
            <div className="mt-8 h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-accent transition-all duration-700" style={{ width: `${(step / (steps.length - 1)) * 100}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-6 gap-2 text-center text-xs">
              {steps.map((s, i) => (
                <div key={s} className={i <= step ? "font-bold" : "text-muted-foreground"}>
                  <div className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full ${i <= step ? "bg-accent text-accent-foreground" : "bg-muted"}`}>{i < step ? <Check className="h-4 w-4" /> : i + 1}</div>{s}
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-around">
              <Ring v={pet.coat} label="Coat health" />
              <Ring v={pet.mood} label="Happiness" />
              <Ring v={Math.round((step / 5) * 100)} label="Progress" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:col-span-1">
            {[{ i: Droplets, v: "24", l: "Baths" }, { i: Scissors, v: "11", l: "Haircuts" }, { i: Heart, v: "1.2k", l: "Treats" }, { i: Calendar, v: bookings.length, l: "Upcoming" }].map((s, k) => (
              <Tilt key={s.l}><div className={`rounded-3xl p-5 shadow-3d ${k % 2 ? "bg-sun" : "bg-mint"}`}><s.i className="h-6 w-6" /><p className="mt-4 font-display text-3xl font-black">{s.v}</p><p className="text-sm">{s.l}</p></div></Tilt>
            ))}
          </div>

          <div className="rounded-3xl bg-card p-8 shadow-3d">
            <h3 className="text-2xl font-bold">Weekly activity</h3>
            <div className="mt-6 flex h-40 items-end gap-3">
              {weekly.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full rounded-t-xl bg-gradient-to-t from-primary to-accent transition-all hover:scale-y-110 origin-bottom" style={{ height: `${h}%` }} />
                  <span className="text-xs text-muted-foreground">{"MTWTFSS"[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-card p-8 shadow-3d">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Bookings</h3>
              <button onClick={() => setBookings((b) => [...b, { d: `Nov ${15 + b.length}`, s: "Bubble bath", p: pet.name }])} className="rounded-full bg-primary p-2 text-primary-foreground"><Plus className="h-4 w-4" /></button>
            </div>
            <ul className="mt-4 space-y-3">
              {bookings.map((b, i) => (
                <li key={i} className="flex items-center gap-4 rounded-2xl bg-secondary p-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="rounded-xl bg-accent px-3 py-2 text-center text-xs font-bold text-accent-foreground">{b.d}</div>
                  <div><p className="font-semibold">{b.s}</p><p className="text-xs text-muted-foreground">{b.p}</p></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
