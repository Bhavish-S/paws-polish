import { useRef, type ReactNode } from "react";

export function Tilt({ children, className = "", max = 14 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`transition-transform duration-200 ease-out preserve-3d ${className}`}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        ref.current!.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg) scale(1.03)`;
      }}
      onMouseLeave={() => (ref.current!.style.transform = "perspective(900px) rotateY(0) rotateX(0)")}
    >
      {children}
    </div>
  );
}

export function Nav() {
  return null;
}
