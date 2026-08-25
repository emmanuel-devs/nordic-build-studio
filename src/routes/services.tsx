import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { servicesQuery } from "@/lib/queries";
import { Reveal } from "@/components/site/reveal";
import { ServiceIcon } from "@/components/site/service-icon";

const title = "Construction Services — Design & Build, Contracting | Nordbygg";
const description =
  "Design & build, general contracting, renovation, interior finishing, groundwork and project development for commercial and residential clients in Norway.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  component: ServicesPage,
});

const process = [
  { step: "01", name: "Consult", text: "Site walk, constraints, budget range and a straight answer on feasibility." },
  { step: "02", name: "Design", text: "Drawings, engineering and a costed specification you can hold us to." },
  { step: "03", name: "Build", text: "One programme, our own crews on the critical trades, weekly reporting." },
  { step: "04", name: "Handover", text: "Commissioning, documentation, snagging and a 5-year workmanship warranty." },
];

function ServicesPage() {
  const services = useSuspenseQuery(servicesQuery).data;

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-20">
        <p className="eyebrow">Services</p>
        <h1 className="mt-3 max-w-3xl text-[clamp(2.25rem,6vw,4rem)] leading-[1] font-semibold">
          Everything a building needs, under one contract
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          We take on the whole job or the part of it you need covered. Every service below is
          delivered by our own project managers, with the same reporting and the same warranty.
        </p>
      </section>

      <section className="mx-auto mt-14 max-w-7xl px-5 sm:px-8">
        <ul className="grid gap-4 md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal as="li" key={service.id} delay={(i % 2) * 90}>
              <article className="flex h-full flex-col rounded-3xl border border-border bg-card p-8">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent">
                  <ServiceIcon name={service.icon} className="h-5 w-5 text-accent-foreground" />
                </span>
                <h2 className="mt-6 text-2xl font-semibold">{service.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {service.blurb}
                </p>
                <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed">
                  {service.body}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow">How we work</p>
          <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">From first call to handover</h2>
        </Reveal>
        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {process.map((item, i) => (
            <Reveal as="li" key={item.step} delay={i * 80}>
              <div className="h-full rounded-3xl border border-border bg-secondary/50 p-7">
                <span className="font-display text-3xl font-semibold text-muted-foreground">
                  {item.step}
                </span>
                <h3 className="mt-4 text-xl font-semibold">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col items-start gap-6 rounded-4xl border border-border bg-ink p-9 text-ink-foreground sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <h2 className="max-w-lg text-3xl font-semibold sm:text-4xl">
            Not sure which service fits? Describe the site and we'll tell you.
          </h2>
          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
          >
            Talk to us <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
