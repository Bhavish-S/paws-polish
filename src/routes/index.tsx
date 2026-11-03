import { createFileRoute, Link } from "@tanstack/react-router";
import { Scissors, Bath, Sparkles, HeartPulse, Star, ArrowRight } from "lucide-react";
import dog from "@/assets/hero-dog.png";
import { SiteNav } from "@/components/SiteNav";
import { Tilt } from "@/components/Tilt";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fur&Fern — Luxury Pet Grooming Spa" },
      { name: "description", content: "Bubble baths, breed-perfect cuts and spa days for your pets." },
      { property: "og:title", content: "Fur&Fern — Luxury Pet Grooming Spa" },
      { property: "og:description", content: "Bubble baths, breed-perfect cuts and spa days for your pets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Bath, t: "Bubble Spa", d: "Oatmeal foam baths at the perfect 37°C." },
  { icon: Scissors, t: "Breed Cuts", d: "Certified stylists for 120+ breeds." },
  { icon: HeartPulse, t: "Health Scan", d: "Skin, ear & nail check every visit." },
  { icon: Sparkles, t: "Pawdicure", d: "Paw balm, nail art and a little bow." },
];

function Index() {
  return (
    <div className="overflow-hidden">
      <SiteNav />
      <section className="relative min-h-screen bg-hero flex items-center pt-28 pb-16">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className="bubble" style={{ left: `${(i * 7.3) % 100}%`, width: 20 + (i % 5) * 14, height: 20 + (i % 5) * 14, animationDuration: `${8 + (i % 6) * 2}s`, animationDelay: `${i * 0.7}s` }} />
        ))}
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-sm shadow-sm">
              <Star className="h-4 w-4 fill-sun text-sun" /> 4.9 from 2,300 happy tails
            </span>
            <h1 className="mt-6 text-6xl md:text-8xl font-black leading-[0.9] tracking-tight">
              Spa days <em className="text-accent">for</em> fluffballs.
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">Gentle grooming, bubble baths and breed-perfect styling — tracked live from your pet dashboard.</p>
            <div className="mt-8 flex gap-3">
              <Link to="/book" search={{ plan: "Spa" }} className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 font-semibold text-accent-foreground shadow-3d transition hover:-translate-y-1">
                Book a session <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/services" className="rounded-full border-2 border-primary px-7 py-4 font-semibold hover:bg-primary hover:text-primary-foreground transition">Services</Link>
            </div>
          </div>
          <Tilt className="relative" max={20}>
            <div className="absolute inset-8 rounded-full bg-primary" style={{ transform: "translateZ(-60px)" }} />
            <img src={dog} alt="Freshly groomed doodle" width={1024} height={1024} className="relative animate-floaty drop-shadow-2xl" style={{ transform: "translateZ(60px)" }} />
            <div className="absolute top-10 -left-2 rounded-2xl bg-card p-4 shadow-3d" style={{ transform: "translateZ(100px)" }}>
              <p className="text-xs text-muted-foreground">Now grooming</p><p className="font-display font-bold">Biscuit 🐾</p>
            </div>
            <div className="absolute bottom-16 right-0 rounded-2xl bg-sun p-4 shadow-3d" style={{ transform: "translateZ(120px)" }}>
              <p className="font-display text-2xl font-black">98%</p><p className="text-xs">fluffiness</p>
            </div>
          </Tilt>
        </div>
      </section>

      <div className="bg-primary py-5 text-primary-foreground">
        <div className="flex w-max animate-marquee gap-12 font-display text-3xl italic">
          {Array.from({ length: 2 }).flatMap((_, k) => ["Bubble baths", "✦", "Blowouts", "✦", "Pawdicures", "✦", "Teeth sparkle", "✦", "De-shedding", "✦"].map((w, i) => <span key={`${k}${i}`}>{w}</span>))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-5xl font-black">Not just a trim.</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Tilt key={f.t}>
              <div className={`h-full rounded-3xl p-7 shadow-3d ${["bg-card", "bg-mint", "bg-sun", "bg-coral text-accent-foreground"][i]}`}>
                <f.icon className="h-10 w-10" style={{ transform: "translateZ(40px)" }} />
                <h3 className="mt-10 text-2xl font-bold">{f.t}</h3>
                <p className="mt-2 opacity-80">{f.d}</p>
              </div>
            </Tilt>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center py-16" style={{ perspective: 1000 }}>
          <div className="relative h-48 w-48 animate-spin3d preserve-3d">
            {["🐶", "🐱", "🛁", "✂️", "🦴", "🐾"].map((e, i) => {
              const t = ["rotateY(0)", "rotateY(90deg)", "rotateY(180deg)", "rotateY(-90deg)", "rotateX(90deg)", "rotateX(-90deg)"][i];
              return <div key={i} className="absolute inset-0 flex items-center justify-center rounded-3xl border-4 border-primary bg-card/90 text-7xl" style={{ transform: `${t} translateZ(96px)` }}>{e}</div>;
            })}
          </div>
        </div>
        <div>
          <h2 className="text-5xl font-black">Your pet’s life, in one dashboard.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Live grooming status, coat-health scores, upcoming bookings and photo diaries — all in real time.</p>
          <Link to="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground shadow-3d">Open dashboard <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">© 2026 Fur&Fern Grooming Spa</footer>
    </div>
  );
}
