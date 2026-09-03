import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import teamMeeting from "@/assets/team-meeting.jpg";
import detailPlans from "@/assets/detail-plans.jpg";
import { Reveal } from "@/components/site/reveal";

const title = "About Nordbygg — Oslo Construction Company";
const description =
  "Thirty years of building in Norway. Nordbygg is an employee-led contractor of 100+ carpenters, engineers and project managers delivering design & build projects.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: AboutPage,
});

const pillars = [
  {
    name: "Our mission",
    text: "To deliver exceptional construction that exceeds client expectations — quality craftsmanship, transparent budgets and integrity on every site we hold the keys to.",
  },
  {
    name: "Our vision",
    text: "To be the contractor Norwegian developers call first for complex timber and mixed-use projects, and the employer skilled tradespeople want to stay with.",
  },
  {
    name: "Our history",
    text: "Founded in Oslo in 1996 as a two-man carpentry firm. Today 104 employees, five in-house trades, and a portfolio spanning schools, headquarters, apartments and heritage restoration.",
  },
];

const values = [
  { title: "Safety before schedule", text: "Zero lost-time incidents across our last 14 projects." },
  { title: "Own the trades", text: "Carpentry, concrete, groundwork and finishing are in-house." },
  { title: "Honest numbers", text: "Weekly cost reports, no variations sprung at handover." },
  { title: "Build for 60 years", text: "Details specified for Nordic weather, not for the photo." },
];

const team = [
  { name: "Anders Lie", role: "Managing Director" },
  { name: "Silje Nordahl", role: "Head of Design & Build" },
  { name: "Petter Aas", role: "Construction Director" },
  { name: "Hanna Berg", role: "Head of Cost & Planning" },
];

function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-20">
        <p className="eyebrow">About us</p>
        <h1 className="mt-3 max-w-3xl text-[clamp(2.25rem,6vw,4rem)] leading-[1] font-semibold">
          A construction company built by the people who do the work
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Nordbygg has been building in and around Oslo since 1996. We stayed a contractor that
          owns its trades — because the quality of a building is decided by whoever is holding the
          tools on a wet Tuesday in November.
        </p>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <Reveal className="overflow-hidden rounded-4xl border border-border">
            <img
              src={teamMeeting}
              alt="Nordbygg project team on site reviewing drawings"
              width={1400}
              height={1000}
              className="aspect-[7/5] w-full object-cover"
            />
          </Reveal>
          <Reveal delay={100} className="overflow-hidden rounded-4xl border border-border">
            <img
              src={detailPlans}
              alt="Technical drawings and measuring tools on a desk"
              loading="lazy"
              width={1200}
              height={900}
              className="aspect-[7/5] h-full w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.name} delay={i * 90}>
              <article className="h-full rounded-3xl border border-border bg-card p-8">
                <h2 className="text-2xl font-semibold">{pillar.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow">What we hold to</p>
          <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Values that survive a site</h2>
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => (
            <Reveal as="li" key={value.title} delay={i * 80}>
              <div className="h-full rounded-3xl border border-border bg-secondary/50 p-7">
                <h3 className="text-lg font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow">Leadership</p>
          <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Who you'll be dealing with</h2>
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((person, i) => (
            <Reveal as="li" key={person.name} delay={i * 80}>
              <div className="rounded-3xl border border-border bg-card p-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent font-display text-lg font-semibold text-accent-foreground">
                  {person.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <h3 className="mt-5 text-lg font-semibold">{person.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{person.role}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col items-start gap-6 rounded-4xl border border-border bg-ink p-9 text-ink-foreground sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <h2 className="max-w-lg text-3xl font-semibold sm:text-4xl">
            Want references from clients like you? Just ask.
          </h2>
          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
          >
            Contact us <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
