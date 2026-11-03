import { useSyncExternalStore } from "react";

export type Pet = { id: string; name: string; breed: string; e: string; coat: number; mood: number };
export type Booking = { id: string; petId: string; plan: string; addons: string[]; date: string; time: string; total: number; status: "upcoming" | "done" | "cancelled" };
type State = { pets: Pet[]; bookings: Booking[]; points: number; step: number };

export const PLANS = [
  { id: "Splash", price: 799, e: "🛁", mins: 45, items: ["Bubble bath", "Blow dry", "Ear clean"] },
  { id: "Spa", price: 1499, e: "✨", mins: 90, items: ["Everything in Splash", "Breed haircut", "Pawdicure", "Teeth sparkle"] },
  { id: "Royal", price: 2499, e: "👑", mins: 150, items: ["Everything in Spa", "Health scan", "Aromatherapy", "Photo shoot"] },
] as const;
export const ADDONS = [
  { id: "De-shedding", price: 299 },
  { id: "Flea shield", price: 349 },
  { id: "Nail art", price: 199 },
  { id: "Pickup & drop", price: 249 },
];
export const SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

export function priceFor(plan: string, addons: string[], points = 0, usePoints = false) {
  const base = PLANS.find((p) => p.id === plan)?.price ?? 0;
  const add = addons.reduce((s, a) => s + (ADDONS.find((x) => x.id === a)?.price ?? 0), 0);
  const discount = usePoints ? Math.min(points, base + add) : 0;
  return { base, add, discount, total: base + add - discount };
}

const KEY = "furfern-v1";
const initial: State = {
  pets: [
    { id: "p1", name: "Biscuit", breed: "Goldendoodle", e: "🐶", coat: 92, mood: 98 },
    { id: "p2", name: "Miso", breed: "Persian cat", e: "🐱", coat: 78, mood: 85 },
  ],
  bookings: [],
  points: 250,
  step: 2,
};
let state: State = initial;
let loaded = false;
const subs = new Set<() => void>();
function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { const s = localStorage.getItem(KEY); if (s) state = { ...initial, ...JSON.parse(s) }; } catch {}
}
export function setState(fn: (s: State) => State) {
  load();
  state = fn(state);
  localStorage.setItem(KEY, JSON.stringify(state));
  subs.forEach((f) => f());
}
export function useStore() {
  return useSyncExternalStore(
    (f) => { subs.add(f); if (!loaded) { load(); f(); } return () => subs.delete(f); },
    () => state,
    () => initial,
  );
}
export const uid = () => Math.random().toString(36).slice(2, 9);
