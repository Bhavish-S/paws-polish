import { Link } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";

export function SiteNav() {
  const cls = "px-4 py-2 rounded-full text-sm font-medium hover:bg-secondary transition";
  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <nav className="flex items-center gap-1 rounded-full border bg-card/80 backdrop-blur-xl px-3 py-2 shadow-3d">
        <Link to="/" className="flex items-center gap-2 pr-4 font-display text-lg font-bold">
          <PawPrint className="h-5 w-5 text-accent" /> Fur&Fern
        </Link>
        <Link to="/" className={cls} activeOptions={{ exact: true }} activeProps={{ className: "bg-secondary" }}>Home</Link>
        <Link to="/services" className={cls} activeProps={{ className: "bg-secondary" }}>Services</Link>
        <Link to="/dashboard" className={`${cls} bg-primary text-primary-foreground hover:bg-primary/90`}>Dashboard</Link>
      </nav>
    </header>
  );
}
