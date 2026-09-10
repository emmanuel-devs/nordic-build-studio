import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { projectQuery, projectsQuery } from "@/lib/queries";
import { imageFor } from "@/lib/images";
import { parseMetrics } from "@/lib/case-study";
import { Reveal } from "@/components/site/reveal";
import { ParallaxImage } from "@/components/site/parallax-image";
import { Magnetic } from "@/components/site/magnetic";
import { ProjectCard } from "@/components/site/project-card";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ context, params }) => {
    const project = await context.queryClient.ensureQueryData(projectQuery(params.slug));
    if (!project) throw notFound();
    await context.queryClient.ensureQueryData(projectsQuery);
    return { title: project.title, summary: project.summary };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Project not found — Nordbygg" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.title} — Nordbygg Project`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.summary },
      ],
    };
  },
  component: ProjectDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="text-4xl font-semibold">Project not found</h1>
      <p className="mt-3 text-muted-foreground">
        This reference may have been renamed or removed.
      </p>
      <Link
        to="/projects"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ink-foreground"
      >
        All projects
      </Link>
    </div>
  ),
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const project = useSuspenseQuery(projectQuery(slug)).data!;
  const related = useSuspenseQuery(projectsQuery)
    .data.filter((p) => p.slug !== slug)
    .slice(0, 3);

  const specs = [
    { label: "Location", value: project.location },
    { label: "Client", value: project.client },
    { label: "Scope", value: project.scope },
    { label: "Contract value", value: project.contract_value },
    { label: "On site", value: project.duration },
    { label: "Completed", value: project.completed_on },
  ];

  const metrics = parseMetrics(project.metrics);
  const chapters = [
    { label: "The challenge", body: project.challenge },
    { label: "Our approach", body: project.approach },
    { label: "The outcome", body: project.outcome },
  ].filter((chapter) => chapter.body);


  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-8 sm:pt-14">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All projects
        </Link>
        <p className="eyebrow mt-8">{project.category}</p>
        <h1 className="mt-3 max-w-4xl text-[clamp(2.25rem,6vw,4rem)] leading-[1] font-semibold">
          {project.title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {project.summary}
        </p>

        <ParallaxImage
          src={imageFor(project.image_key)}
          alt={`${project.title} in ${project.location}`}
          eager
          className="mt-10 aspect-[16/9]"
        />

        {metrics.length > 0 ? (
          <dl className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3">
            {metrics.map((metric, i) => (
              <Reveal key={metric.label} delay={i * 90} className="bg-card p-7">
                <dt className="eyebrow">{metric.label}</dt>
                <dd className="mt-2 font-display text-4xl font-semibold tracking-tight">
                  {metric.value}
                </dd>
              </Reveal>
            ))}
          </dl>
        ) : null}
      </section>


      <section className="mx-auto mt-12 max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr]">
          <Reveal>
            <h2 className="text-3xl font-semibold">About the build</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{project.body}</p>
          </Reveal>

          <Reveal delay={100}>
            <dl className="rounded-3xl border border-border bg-card p-7">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="grid grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] gap-4 border-b border-border py-3.5 last:border-0"
                >
                  <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                  <dd className="text-sm font-medium">{spec.value || "—"}</dd>
                </div>
              ))}
            </dl>
            <Link
              to="/contact"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:border-accent"
            >
              Discuss a similar project <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {project.gallery_keys.length > 0 ? (
        <section className="mx-auto mt-16 max-w-7xl px-5 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {project.gallery_keys.map((key, i) => (
              <Reveal key={`${key}-${i}`} delay={i * 90}>
                <img
                  src={imageFor(key)}
                  alt={`${project.title} — detail ${i + 1}`}
                  loading="lazy"
                  width={1400}
                  height={1000}
                  className="aspect-[4/3] w-full rounded-3xl border border-border object-cover"
                />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
        <h2 className="text-3xl font-semibold">More projects</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <ProjectCard key={item.id} project={item} />
          ))}
        </div>
      </section>
    </>
  );
}
