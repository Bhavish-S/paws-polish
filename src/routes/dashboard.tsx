import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Calendar, Droplets, Heart, Plus, Check, X, Trash2, Gift } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Tilt } from "@/components/Tilt";
import { setState, uid, useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Pet Dashboard — Fur&Fern" },
      { name: "description", content: "Track grooming progress, bookings, paw points and pet health." },
      { property: "og:title", content: "Pet Dashboard — Fur&Fern" },
      { property: "og:description", content: "Track grooming progress, bookings, paw points and pet health." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const steps = ["Check-in", "Bubble bath", "Blow dry", "Haircut", "Pawdicure", "Ready!"];
const EMOJI = ["🐶", "🐱", "🐕", "🐩", "🐈", "🐰"];

function Ring({ v, label }: { v: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-24 rounded-full transition-all" style={{ background: `conic-gradient(var(--coral) ${v * 3.6}deg, var(--muted) 0)` }}>
        <div className="absolute inset-2 flex items-center justify-center rounded-full bg-card font-display text-2xl font-black">{v}</div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Dashboard() {
  const s = useStore();
  const [selId, setSel] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", breed: "", e: "🐶" });
  const [tab, setTab] = useState<"upcoming" | "done" | "cancelled">("upcoming");
  const pet = s.pets.find((p) => p.id === selId) ?? s.pets[0];
  const step = s.step;
  const list = s.bookings.filter((b) => b.status === tab);
  const spent = s.bookings.filter((b) => b.status !== "cancelled").reduce((a, b) => a + b.total, 0);
  const tier = s.points >= 1000 ? "Royal" : s.points >= 500 ? "Gold" : "Silver";
  const next = s.points >= 1000 ? 1000 : s.points >= 500 ? 1000 : 500;

  const addPet = () => {
    if (!form.name.trim()) return toast.error("Give your pet a name");
    const id = uid();
    setState((st) => ({ ...st, pets: [...st.pets, { id, name: form.name.trim(), breed: form.breed.trim() || "Good boy", e: form.e, coat: 70, mood: 90 }] }));
    setSel(id); setAdding(false); setForm({ name: "", breed: "", e: "🐶" });
    toast.success(`${form.name} joined the pack!`);
  };
  const setStatus = (id: string, status: "done" | "cancelled") => {
    setState((st) => ({ ...st, bookings: st.bookings.map((b) => (b.id === id ? { ...b, status } : b)) }));
    toast(status === "done" ? "Marked as completed ✅" : "Booking cancelled");
  };
  const advance = () => {
    const n = (step + 1) % steps.length;
    setState((st) => ({ ...st, step: n }));
    if (n === steps.length - 1) toast.success(`${pet?.name ?? "Your pet"} is ready for pickup! 🎀`);
  };
  const redeem = () => {
    if (s.points < 200) return toast.error("You need 200 points for a free treat box");
    setState((st) => ({ ...st, points: st.points - 200 }));
    toast.success("Treat box added to your next visit 🦴");
  };

  return (
    <div className="min-h-screen bg-hero">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-6 pt-32 pb-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-5xl font-black">Hello, pet parent 👋</h1>
          <Link to="/book" search={{ plan: "Spa" }} className="rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground shadow-3d transition hover:-translate-y-1">+ New booking</Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {s.pets.map((p) => (
            <button key={p.id} onClick={() => setSel(p.id)} className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-medium transition ${p.id === pet?.id ? "bg-primary text-primary-foreground shadow-3d -translate-y-1" : "bg-card hover:bg-secondary"}`}>
              <span className="text-xl">{p.e}</span>{p.name}
            </button>
          ))}
          <button onClick={() => setAdding(!adding)} className="flex items-center gap-1 rounded-full border-2 border-dashed border-primary px-5 py-2 font-medium hover:bg-card"><Plus className="h-4 w-4" />Add pet</button>
        </div>

        {adding && (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-3xl bg-card p-5 shadow-3d animate-in fade-in slide-in-from-top-2">
            <div className="flex gap-1">{EMOJI.map((e) => <button key={e} onClick={() => setForm({ ...form, e })} className={`rounded-xl p-2 text-2xl ${form.e === e ? "bg-sun" : ""}`}>{e}</button>)}</div>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="rounded-full border bg-background px-4 py-2" />
            <input value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} placeholder="Breed" className="rounded-full border bg-background px-4 py-2" />
            <button onClick={addPet} className="rounded-full bg-primary px-5 py-2 font-semibold text-primary-foreground">Save</button>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {pet ? (
            <Tilt max={8}>
              <div className="relative rounded-3xl bg-primary p-8 text-primary-foreground shadow-3d">
                <button aria-label="Remove pet" onClick={() => { setState((st) => ({ ...st, pets: st.pets.filter((p) => p.id !== pet.id) })); setSel(null); toast(`${pet.name} removed`); }} className="absolute right-5 top-5 rounded-full p-2 opacity-60 hover:bg-primary-foreground/15 hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
                <div className="text-8xl animate-floaty" style={{ transform: "translateZ(70px)" }}>{pet.e}</div>
                <h2 className="mt-4 text-4xl font-black">{pet.name}</h2>
                <p className="opacity-70">{pet.breed}</p>
                <div className="mt-6 flex gap-2 text-sm">
                  <span className="rounded-full bg-primary-foreground/15 px-3 py-1">Vaccinated</span>
                  <span className="rounded-full bg-primary-foreground/15 px-3 py-1">{tier} member</span>
                </div>
              </div>
            </Tilt>
          ) : <div className="rounded-3xl bg-card p-8 shadow-3d">Add your first pet to get started.</div>}

          <div className="rounded-3xl bg-card p-8 shadow-3d lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Live grooming tracker</h3>
              <button onClick={advance} className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:scale-105">{step === steps.length - 1 ? "Restart" : "Next step"}</button>
            </div>
            <div className="mt-8 h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-accent transition-all duration-700" style={{ width: `${(step / (steps.length - 1)) * 100}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-6 gap-2 text-center text-xs">
              {steps.map((st, i) => (
                <div key={st} className={i <= step ? "font-bold" : "text-muted-foreground"}>
                  <div className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full ${i <= step ? "bg-accent text-accent-foreground" : "bg-muted"}`}>{i < step ? <Check className="h-4 w-4" /> : i + 1}</div>{st}
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-around">
              <Ring v={pet?.coat ?? 0} label="Coat health" />
              <Ring v={pet?.mood ?? 0} label="Happiness" />
              <Ring v={Math.round((step / 5) * 100)} label="Progress" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[{ i: Calendar, v: s.bookings.filter((b) => b.status === "upcoming").length, l: "Upcoming" }, { i: Check, v: s.bookings.filter((b) => b.status === "done").length, l: "Completed" }, { i: Droplets, v: `₹${spent}`, l: "Total spent" }, { i: Heart, v: s.pets.length, l: "Pets" }].map((x, k) => (
              <Tilt key={x.l}><div className={`h-full rounded-3xl p-5 shadow-3d ${k % 3 ? "bg-sun" : "bg-mint"}`}><x.i className="h-6 w-6" /><p className="mt-4 font-display text-3xl font-black">{x.v}</p><p className="text-sm">{x.l}</p></div></Tilt>
            ))}
          </div>

          <div className="rounded-3xl bg-coral p-8 text-accent-foreground shadow-3d">
            <div className="flex items-center justify-between"><h3 className="text-2xl font-bold">Paw points</h3><Gift className="h-6 w-6" /></div>
            <p className="mt-4 font-display text-6xl font-black">{s.points}</p>
            <p className="text-sm opacity-90">{tier} tier · {Math.max(0, next - s.points)} to next tier</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-accent-foreground/25"><div className="h-full bg-accent-foreground transition-all" style={{ width: `${Math.min(100, (s.points / next) * 100)}%` }} /></div>
            <button onClick={redeem} className="mt-6 w-full rounded-full bg-accent-foreground py-3 font-semibold text-accent">Redeem treat box · 200 pts</button>
          </div>

          <div className="rounded-3xl bg-card p-8 shadow-3d">
            <h3 className="text-2xl font-bold">Bookings</h3>
            <div className="mt-4 flex gap-1 rounded-full bg-muted p-1 text-sm">
              {(["upcoming", "done", "cancelled"] as const).map((t) => <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-full py-1.5 capitalize ${tab === t ? "bg-card font-semibold shadow-sm" : ""}`}>{t}</button>)}
            </div>
            <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto">
              {list.map((b) => (
                <li key={b.id} className="flex items-center gap-3 rounded-2xl bg-secondary p-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="rounded-xl bg-accent px-3 py-2 text-center text-xs font-bold text-accent-foreground">{b.date.slice(4, 10)}<br />{b.time}</div>
                  <div className="flex-1"><p className="font-semibold">{b.plan} · ₹{b.total}</p><p className="text-xs text-muted-foreground">{s.pets.find((p) => p.id === b.petId)?.name ?? "Pet"}{b.addons.length ? ` + ${b.addons.length} extras` : ""}</p></div>
                  {tab === "upcoming" && <>
                    <button aria-label="Complete" onClick={() => setStatus(b.id, "done")} className="rounded-full bg-mint p-2"><Check className="h-4 w-4" /></button>
                    <button aria-label="Cancel" onClick={() => setStatus(b.id, "cancelled")} className="rounded-full bg-card p-2"><X className="h-4 w-4" /></button>
                  </>}
                </li>
              ))}
              {!list.length && <li className="py-6 text-center text-sm text-muted-foreground">Nothing here yet. {tab === "upcoming" && <Link to="/book" search={{ plan: "Spa" }} className="font-semibold text-accent underline">Book now</Link>}</li>}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
