# Nordbygg — Modern Construction Company Website

A premium, Nordic-leaning construction site with a real editable backend for projects, services and enquiries. Visual language follows the uploaded reference: warm off-white canvas, near-black typography, amber accent, soft rounded cards, large photography.

## Brand

- Name: **Nordbygg** — Oslo-based, turnkey commercial and residential construction.
- Positioning line: "Design, build and deliver — from first sketch to handover."
- Palette (from the reference screenshot): canvas `#faf8f5`, card `#ffffff`, ink `#141414`, muted `#6b6560`, amber accent `#f0a92a`, subtle sand borders.
- Typography: geometric grotesque headings (tight tracking, large sizes) + clean humanist body. Generous whitespace, 20–24px card radii, pill buttons.
- Motion: restrained — scroll-reveal fades/rises, image parallax on hero and project cards, hover lift on cards, counter animation on stats. No bounce, no gradients.

## Pages

1. **Home** — hero with headline + rotating badge, large hero image with side intro card and stats bar (150+ projects, 100+ team, 200+ reviews, 30 awards), services carousel, about split with mission/vision/history, client logo strip, "Quality That Speaks for Itself" video-style block with checklist, featured projects (3), testimonials, CTA band.
2. **Services** — full service grid (Building Renovation, Interior Finishing, Roofing, Foundation Repair, Design & Build, General Contracting) with detail cards and process timeline (Consult → Design → Build → Handover).
3. **Projects** — filterable gallery (Commercial / Residential / Renovation) of project cards with large imagery.
4. **Project detail** (`/projects/$slug`) — hero image, spec table (location, date, scope, client), gallery, related projects.
5. **About** — story, mission/vision, team, values, awards.
6. **Contact** — enquiry form (name, email, phone, project type, budget, message), office details, hours, map-style block.
7. **Admin** (`/admin`, login-gated) — manage projects, services, and read enquiries.

## Backend (Lovable Cloud)

Tables with RLS + grants:
- `projects` — slug, title, category, summary, body, location, client, scope, dates, cover image, gallery, featured flag, sort order. Public read; admin write.
- `services` — slug, title, blurb, body, icon, sort order. Public read; admin write.
- `enquiries` — name, email, phone, project type, budget, message, created_at. Public insert; admin read.
- `user_roles` + `app_role` enum + `has_role()` security-definer function for admin gating (roles never on profiles).
- Email/password auth for the admin area only; the public site needs no login.
- Seed migration inserts 6 services and 6 real-looking projects so every page is populated on first load.

## Imagery

AI-generated construction photography saved to `src/assets` and referenced via CDN asset pointers: hero site scene, 6 project covers, 4 gallery shots, team/portrait, mission/detail shots. Consistent grade — natural daylight, high-vis workwear, Nordic materials.

## Technical notes

- TanStack Start file routes: `index.tsx`, `services.tsx`, `projects.index.tsx`, `projects.$slug.tsx`, `about.tsx`, `contact.tsx`, `_authenticated/admin*`.
- Design tokens defined in `src/styles.css` (`@theme inline` + oklch values); no hardcoded color utilities in components.
- Shared header (sticky, condensed on scroll) and footer in `__root.tsx`; mobile drawer nav.
- Public reads via server functions with the publishable client; admin writes via authenticated server functions with role checks.
- Contact form posts through a server function that validates with Zod and inserts into `enquiries`.
- Per-route `head()` metadata (unique title/description/og), semantic HTML, single H1 per page, alt text, lazy-loaded imagery, JSON-LD `GeneralContractor` on home and `Project`-style data on detail pages.
- Fonts loaded via `<link>` in the root head.
