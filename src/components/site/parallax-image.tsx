import { useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Image framed by a fixed-ratio mask; the picture itself drifts slowly
 * against the scroll. Respects prefers-reduced-motion.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  imageClassName,
  strength = 60,
  eager = false,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  strength?: number;
  eager?: boolean;
  style?: CSSProperties;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = frame.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      // -1 (below viewport) .. 1 (above viewport)
      const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      img.style.transform = `translate3d(0, ${(progress * strength).toFixed(2)}px, 0) scale(1.12)`;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [strength]);

  return (
    <div
      ref={frameRef}
      style={style}
      className={cn("overflow-hidden rounded-4xl border border-border", className)}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        width={1600}
        height={1100}
        className={cn("h-full w-full scale-[1.12] object-cover will-change-transform", imageClassName)}
      />
    </div>
  );
}
