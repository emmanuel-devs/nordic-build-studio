import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center gap-4 rounded-full border border-border/70 px-4 py-2.5 transition-all duration-300 sm:px-5",
          scrolled ? "bg-card/90 shadow-[0_10px_30px_-24px_oklch(0.2_0_0)] backdrop-blur" : "bg-card/60",
        )}
      >
        <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink">
            <span className="h-3 w-3 rounded-sm bg-accent" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">Nordbygg</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "bg-secondary text-foreground" }}
              className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/contact"
          className="ml-auto hidden shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-ink-foreground transition-transform hover:-translate-y-0.5 md:ml-0 md:inline-flex"
        >
          Book a call
        </Link>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open ? (
        <div className="mx-auto mt-2 max-w-7xl rounded-3xl border border-border bg-card p-3 md:hidden">
          <nav className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-base text-foreground hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-2xl bg-ink px-4 py-3 text-center text-base font-medium text-ink-foreground"
            >
              Book a call
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
