import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Re-mounts on pathname change so each page fades/rises in. */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
