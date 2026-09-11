import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  variant = "rise",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
  variant?: "rise" | "clip";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // The clip variant must not sit on the observed node: a clip-path zeroes the
  // intersection rect, so the observer would never fire and the element would
  // stay hidden forever. Clip an inner wrapper instead.
  if (variant === "clip") {
    return (
      <Tag ref={ref as never} className={className}>
        <div
          data-visible={visible}
          style={{ transitionDelay: `${delay}ms` }}
          className="reveal-clip h-full w-full"
        >
          {children}
        </div>
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as never}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}
