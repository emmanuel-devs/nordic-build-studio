import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { imageFor } from "@/lib/images";
import { parseMetrics } from "@/lib/case-study";

export type ProjectSummary = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  location: string;
  completed_on: string;
  image_key: string;
  metrics?: unknown;
};

export function ProjectCard({ project }: { project: ProjectSummary }) {
  const headline = parseMetrics(project.metrics)[0];

  return (
    <Link
      to="/projects/$slug"
      params={{ slug: project.slug }}
      className="group block overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-45px_oklch(0.2_0_0)]"
    >
      <div className="relative overflow-hidden">
        {headline ? (
          <span className="absolute top-4 left-4 z-10 rounded-full bg-ink/85 px-3.5 py-1.5 text-xs font-semibold text-ink-foreground backdrop-blur-sm">
            <span className="text-accent">{headline.value}</span> {headline.label.toLowerCase()}
          </span>
        ) : null}
        <img
          src={imageFor(project.image_key)}
          alt={`${project.title} — ${project.category} project in ${project.location}`}
          loading="lazy"
          width={1400}
          height={1000}
          className="aspect-[7/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 p-6">
        <div className="min-w-0">
          <p className="eyebrow">
            {project.category} · {project.completed_on}
          </p>
          <h3 className="mt-2 text-xl font-semibold">{project.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {project.summary}
          </p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border transition-colors group-hover:bg-accent">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
