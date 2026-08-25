import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { projectsQuery } from "@/lib/queries";
import { Reveal } from "@/components/site/reveal";
import { ProjectCard } from "@/components/site/project-card";
import { cn } from "@/lib/utils";

const title = "Construction Projects & References | Nordbygg";
const description =
  "Commercial, residential and renovation references from Nordbygg — timber apartment blocks, headquarters buildings, warehouse conversions and coastal villas.";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQuery),
  component: ProjectsPage,
});

function ProjectsPage() {
  const projects = useSuspenseQuery(projectsQuery).data;
  const [filter, setFilter] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects],
  );
  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-20">
        <p className="eyebrow">Projects</p>
        <h1 className="mt-3 max-w-3xl text-[clamp(2.25rem,6vw,4rem)] leading-[1] font-semibold">
          References you can visit, walk through and check
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          A selection of recent work. Every project below was delivered by our own project
          managers — ask and we'll put you in touch with the client.
        </p>

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={cn(
                "rounded-full border border-border px-5 py-2.5 text-sm transition-colors",
                filter === category
                  ? "bg-ink text-ink-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-5 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, i) => (
            <Reveal key={project.id} delay={(i % 3) * 80}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
        {visible.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No projects in this category yet.
          </p>
        ) : null}
      </section>
    </>
  );
}
