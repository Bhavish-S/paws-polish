import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { ADDONS, PLANS, SLOTS, priceFor, setState, uid, useStore } from "@/lib/store";

export const Route = createFileRoute("/book")({
  validateSearch: (s: Record<string, unknown>) => ({ plan: typeof s["plan"] === "string" ? s["plan"] : "Spa" }),
  head: () => ({
    meta: [
      { title: "Book a Grooming Session — Fur&Fern" },
      { name: "description", content: "Pick your pet, package, add-ons and time slot in four steps." },
      { property: "og:title", content: "Book a Grooming Session — Fur&Fern" },
      { property: "og:description", content: "Pick your pet, package, add-ons and time slot in four steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Book,
});

const days = Array.from({ length: 10 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i + 1); return d; });

function Book() {
  const { plan: initPlan } = Route.useSearch();
  const s = useStore();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [petId, setPetId] = useState(s.pets[0]?.id ?? "");
  const [plan, setPlan] = useState(initPlan);
  const [addons, setAddons] = useState<string[]>([]);
  const [date, setDate] = useState(days[0]!.toDateString());
  const [time, setTime] = useState("");
  const [usePoints, setUsePoints] = useState(false);
  const taken = s.bookings.filter((b) => b.date === date && b.status === "upcoming").map((b) => b.time);
  const price = priceFor(plan, addons, s.points, usePoints);
  const canNext = [!!petId, !!plan, true, !!time][step];

  const confirm = () => {
    setState((st) => ({
      ...st,
      points: st.points - price.discount + Math.round(price.total / 10),
      bookings: [...st.bookings, { id: uid(), petId, plan, addons, date, time, total: price.total, status: "upcoming" }],
    }));
    toast.success("Booking confirmed! 🎉", { description: `${date} at ${time} · +${Math.round(price.total / 10)} paw points` });
    nav({ to: "/dashboard" });
  };

  const card = (on: boolean) => `rounded-2xl border-2 p-5 text-left transition hover:-translate-y-1 ${on ? "border-accent bg-accent/10 shadow-3d" : "border-border bg-card"}`;

  return (
    <div className="min-h-screen bg-hero">
      <SiteNav />
      <main className="mx-auto grid max-w-6xl gap-8 px-6 pt-32 pb-16 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl bg-card/90 p-8 shadow-3d backdrop-blur">
          <div className="flex gap-2">
            {["Pet", "Package", "Extras", "Time"].map((l, i) => (
              <button key={l} onClick={() => i < step && setStep(i)} className={`flex-1 rounded-full py-2 text-sm font-semibold ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}. {l}</button>
            ))}
          </div>

          <div key={step} className="mt-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {step === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {s.pets.map((p) => (
                  <button key={p.id} onClick={() => setPetId(p.id)} className={card(petId === p.id)}>
                    <span className="text-4xl">{p.e}</span><p className="mt-2 font-display text-xl font-bold">{p.name}</p><p className="text-sm text-muted-foreground">{p.breed}</p>
                  </button>
                ))}
                {!s.pets.length && <p>Add a pet from your dashboard first.</p>}
              </div>
            )}
            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-3">
                {PLANS.map((p) => (
                  <button key={p.id} onClick={() => setPlan(p.id)} className={card(plan === p.id)}>
                    <span className="text-4xl">{p.e}</span><p className="mt-2 font-display text-xl font-bold">{p.id}</p>
                    <p className="font-bold">₹{p.price}</p><p className="text-xs text-muted-foreground">{p.mins} min</p>
                  </button>
                ))}
              </div>
            )}
            {step === 2 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {ADDONS.map((a) => {
                  const on = addons.includes(a.id);
                  return (
                    <button key={a.id} onClick={() => setAddons((x) => (on ? x.filter((y) => y !== a.id) : [...x, a.id]))} className={`${card(on)} flex items-center justify-between`}>
                      <span><p className="font-semibold">{a.id}</p><p className="text-sm text-muted-foreground">+₹{a.price}</p></span>
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${on ? "border-accent bg-accent text-accent-foreground" : ""}`}>{on && <Check className="h-4 w-4" />}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {step === 3 && (
              <div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {days.map((d) => {
                    const v = d.toDateString();
                    return (
                      <button key={v} onClick={() => { setDate(v); setTime(""); }} className={`min-w-16 rounded-2xl px-3 py-3 text-center ${date === v ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                        <p className="text-xs">{d.toLocaleDateString("en", { weekday: "short" })}</p><p className="font-display text-2xl font-black">{d.getDate()}</p>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {SLOTS.map((t) => {
                    const busy = taken.includes(t);
                    return <button key={t} disabled={busy} onClick={() => setTime(t)} className={`rounded-xl py-3 font-semibold transition ${busy ? "bg-muted text-muted-foreground line-through" : time === t ? "bg-accent text-accent-foreground shadow-3d" : "bg-secondary hover:bg-sun"}`}>{t}</button>;
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 flex justify-between">
            <button disabled={step === 0} onClick={() => setStep(step - 1)} className="inline-flex items-center gap-1 rounded-full px-5 py-3 font-semibold disabled:opacity-30"><ChevronLeft className="h-4 w-4" />Back</button>
            {step < 3 ? (
              <button disabled={!canNext} onClick={() => setStep(step + 1)} className="inline-flex items-center gap-1 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground disabled:opacity-40">Next<ChevronRight className="h-4 w-4" /></button>
            ) : (
              <button disabled={!canNext} onClick={confirm} className="rounded-full bg-accent px-7 py-3 font-semibold text-accent-foreground shadow-3d disabled:opacity-40">Confirm ₹{price.total}</button>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-3xl bg-primary p-8 text-primary-foreground shadow-3d lg:sticky lg:top-28">
          <h2 className="text-2xl font-black">Summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between"><dt>Pet</dt><dd>{s.pets.find((p) => p.id === petId)?.name ?? "—"}</dd></div>
            <div className="flex justify-between"><dt>{plan} package</dt><dd>₹{price.base}</dd></div>
            {addons.map((a) => <div key={a} className="flex justify-between opacity-80"><dt>+ {a}</dt><dd>₹{ADDONS.find((x) => x.id === a)!.price}</dd></div>)}
            <div className="flex justify-between"><dt>When</dt><dd>{time ? `${date.slice(4, 10)}, ${time}` : "—"}</dd></div>
          </dl>
          <label className="mt-6 flex cursor-pointer items-center justify-between rounded-2xl bg-primary-foreground/10 p-4 text-sm">
            <span>Use {s.points} paw points</span>
            <input type="checkbox" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} className="h-5 w-5 accent-current" />
          </label>
          {price.discount > 0 && <p className="mt-3 flex justify-between text-sm text-sun"><span>Points discount</span><span>−₹{price.discount}</span></p>}
          <p className="mt-6 flex items-end justify-between border-t border-primary-foreground/20 pt-6"><span>Total</span><span className="font-display text-4xl font-black">₹{price.total}</span></p>
          <p className="mt-2 text-xs opacity-70">Earn {Math.round(price.total / 10)} paw points with this booking.</p>
        </aside>
      </main>
    </div>
  );
}
