import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Check, Play } from "lucide-react";
import { projectsQuery, servicesQuery } from "@/lib/queries";
import { imageFor } from "@/lib/images";
import heroSite from "@/assets/hero-site.jpg";
import teamMeeting from "@/assets/team-meeting.jpg";
import detailPlans from "@/assets/detail-plans.jpg";
import { Reveal } from "@/components/site/reveal";
import { ProjectCard } from "@/components/site/project-card";
import { ServiceIcon } from "@/components/site/service-icon";

const title = "Nordbygg — Turnkey Construction & Design Build, Oslo";
const description =
  "Nordbygg builds commercial and residential projects across Norway: design & build, general contracting, renovation and project development, delivered on programme.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(servicesQuery),
      context.queryClient.ensureQueryData(projectsQuery),
    ]);
  },
  component: HomePage,
});

const stats = [
  { value: "150+", label: "Completed projects" },
  { value: "100+", label: "People on the tools" },
  { value: "200+", label: "Repeat clients" },
  { value: "30", label: "Years building" },
];

const proofPoints = [
  "Fixed price and fixed programme before we break ground",
  "One project manager from feasibility to handover",
  "In-house carpentry, concrete and finishing crews",
  "Weekly cost and progress reporting you can actually read",
];

function HomePage() {
  const services = useSuspenseQuery(servicesQuery).data;
  const projects = useSuspenseQuery(projectsQuery).data;
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "GeneralContractor",
            name: "Nordbygg AS",
            description,
            address: {
              "@type": "PostalAddress",
              streetAddress: "Dronning Eufemias gate 16",
              postalCode: "0191",
              addressLocality: "Oslo",
              addressCountry: "NO",
            },
            telephone: "+47 22 33 44 55",
            email: "post@nordbygg.no",
          }),
        }}
      />

      <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-8 sm:pt-16">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <h1 className="max-w-3xl text-[clamp(2.5rem,7vw,4.75rem)] leading-[0.95] font-semibold">
            Turnkey construction for the way Norway builds now
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            We design, build and deliver commercial and residential projects across Oslo and the
            coast — one contract, one team, one accountable programme.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
          <div className="overflow-hidden rounded-4xl border border-border">
            <img
              src={heroSite}
              alt="Two Nordbygg site managers reviewing drawings in front of a timber-framed building under construction"
              width={1600}
              height={1104}
              className="aspect-[16/11] w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between gap-6 rounded-4xl border border-border bg-card p-7">
            <p className="text-lg leading-relaxed">
              Thirty years of cross-laminated timber, concrete and steel — delivered with
              prefabrication, tight sequencing and crews who have worked together for a decade.
            </p>
            <ul className="grid gap-3 border-y border-border py-6 text-sm text-muted-foreground">
              <li>Fixed-price design & build contracts</li>
              <li>In-house carpentry, concrete and groundwork</li>
              <li>Weekly cost and programme reporting</li>
            </ul>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                Start a project <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                See our work
              </Link>
            </div>
          </div>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-border pt-10 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <dt className="font-display text-4xl font-semibold sm:text-5xl">{stat.value}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{stat.label}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">
        <Reveal className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="min-w-0">
            <p className="eyebrow">What we do</p>
            <h2 className="mt-3 max-w-xl text-4xl font-semibold sm:text-5xl">
              Services tailored to the build in front of us
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary"
          >
            All services <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal as="li" key={service.id} delay={(i % 3) * 90}>
              <Link
                to="/services"
                className="flex h-full flex-col rounded-3xl border border-border bg-card p-7 transition-colors hover:border-accent"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary">
                  <ServiceIcon name={service.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-6 text-xl font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {service.blurb}
                </p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal className="relative overflow-hidden rounded-4xl border border-border">
            <img
              src={teamMeeting}
              alt="Nordbygg site team reviewing a drawing inside an unfinished building"
              loading="lazy"
              width={1400}
              height={1000}
              className="h-full min-h-[320px] w-full object-cover"
            />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-foreground">
                <Play className="h-5 w-5 fill-current" />
              </span>
            </span>
          </Reveal>

          <Reveal delay={100} className="rounded-4xl border border-border bg-card p-8 sm:p-10">
            <p className="eyebrow">Why Nordbygg</p>
            <h2 className="mt-3 text-4xl font-semibold">Quality that speaks for itself</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Our craftspeople and project managers have delivered together for years. That
              continuity is why our clients keep coming back — and why our snag lists are short.
            </p>
            <ul className="mt-7 space-y-3.5">
              {proofPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent">
                    <Check className="h-3 w-3 text-accent-foreground" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ink-foreground"
            >
              About the company <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">
        <Reveal className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="min-w-0">
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-3 max-w-xl text-4xl font-semibold sm:text-5xl">
              Featured construction projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
          >
            Go to projects <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <Reveal key={project.id} delay={(i % 3) * 90}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">
        <Reveal className="grid items-stretch gap-4 overflow-hidden rounded-4xl border border-border bg-ink text-ink-foreground lg:grid-cols-[1.2fr_1fr]">
          <div className="p-9 sm:p-12">
            <p className="eyebrow text-ink-foreground/60">Next step</p>
            <h2 className="mt-3 max-w-lg text-4xl font-semibold sm:text-5xl">
              Tell us about the site. We'll tell you what it takes.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-foreground/70">
              Send drawings, a sketch or just an address. You'll get an honest read on
              buildability, programme and cost range within five working days.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
            >
              Request a consultation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <img
            src={detailPlans}
            alt="Architect's hands measuring a technical drawing"
            loading="lazy"
            width={1200}
            height={900}
            className="h-full min-h-[260px] w-full object-cover"
          />
        </Reveal>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              quote:
                "Nordbygg handed over three weeks early on a timber build most contractors told us was too complex for the site.",
              name: "Ingrid Halvorsen",
              role: "Fjordbo Eiendom",
              key: "harbor",
            },
            {
              quote:
                "The weekly reporting was the difference. We never once had to chase them for a number.",
              name: "Martin Sæther",
              role: "Nordlys Group",
              key: "office",
            },
            {
              quote:
                "They treated a listed warehouse with the care of restorers and the programme discipline of contractors.",
              name: "Kari Lund",
              role: "Havnelageret AS",
              key: "warehouse",
            },
          ].map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-7">
                <blockquote className="text-base leading-relaxed">“{t.quote}”</blockquote>
                <figcaption className="mt-7 flex items-center gap-3">
                  <img
                    src={imageFor(t.key)}
                    alt=""
                    loading="lazy"
                    width={80}
                    height={80}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <span className="text-sm">
                    <span className="block font-medium">{t.name}</span>
                    <span className="block text-muted-foreground">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
