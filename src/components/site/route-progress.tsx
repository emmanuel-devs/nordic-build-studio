import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

/** Slim amber progress bar shown while a route (or its data) is loading. */
export function RouteProgress() {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" || s.isLoading });
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setProgress(8);
      const timer = window.setInterval(() => {
        setProgress((p) => (p < 90 ? p + Math.max(1, (90 - p) * 0.12) : p));
      }, 120);
      return () => window.clearInterval(timer);
    }

    if (!visible) return;
    setProgress(100);
    const timeout = window.setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [isLoading, visible]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Page loading"
      aria-hidden={!visible}
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5"
    >
      <div
        className="h-full bg-accent transition-[width,opacity] duration-300 ease-out"
        style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
      />
    </div>
  );
}
