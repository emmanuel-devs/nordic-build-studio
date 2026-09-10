import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Subtle magnetic pull towards the cursor. Pointer-fine devices only —
 * touch and reduced-motion users get a plain static wrapper.
 */
export function Magnetic({
  children,
  className,
  strength = 0.25,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const allowed = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <span
      ref={ref}
      className={cn("inline-block transition-transform duration-300 ease-out", className)}
      onPointerMove={(event) => {
        const node = ref.current;
        if (!node || !allowed()) return;
        const rect = node.getBoundingClientRect();
        const x = (event.clientX - (rect.left + rect.width / 2)) * strength;
        const y = (event.clientY - (rect.top + rect.height / 2)) * strength;
        node.style.transition = "transform 120ms ease-out";
        node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      }}
      onPointerLeave={() => {
        const node = ref.current;
        if (!node) return;
        node.style.transition = "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)";
        node.style.transform = "translate3d(0, 0, 0)";
      }}
    >
      {children}
    </span>
  );
}
