import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { imageFor } from "@/lib/images";

export type ProjectSummary = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  location: string;
  completed_on: string;
  image_key: string;
};

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: project.slug }}
      className="group block overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-45px_oklch(0.2_0_0)]"
    >
      <div className="overflow-hidden">
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
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
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
