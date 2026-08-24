import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink">
              <span className="h-3 w-3 rounded-sm bg-accent" />
            </span>
            <span className="font-display text-lg font-semibold">Nordbygg</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Turnkey commercial and residential construction in Oslo and along the Norwegian coast.
            Design, build and deliver — from first sketch to handover.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/services" className="hover:text-foreground">
                Services
              </Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-foreground">
                Projects
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-foreground">
                About us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Get in touch</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>Dronning Eufemias gate 16, 0191 Oslo</li>
            <li>
              <a href="mailto:post@nordbygg.no" className="hover:text-foreground">
                post@nordbygg.no
              </a>
            </li>
            <li>
              <a href="tel:+4722334455" className="hover:text-foreground">
                +47 22 33 44 55
              </a>
            </li>
            <li>Mon–Fri, 07:00–16:00</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Nordbygg AS. Org. nr. 912 456 789 MVA.</p>
          <Link to="/admin" className="hover:text-foreground">
            Client portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
