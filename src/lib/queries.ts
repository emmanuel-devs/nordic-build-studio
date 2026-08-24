import { queryOptions } from "@tanstack/react-query";
import { getProject, listProjects, listServices } from "./content.functions";

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: () => listServices(),
});

export const projectsQuery = queryOptions({
  queryKey: ["projects"],
  queryFn: () => listProjects(),
});

export const projectQuery = (slug: string) =>
  queryOptions({
    queryKey: ["project", slug],
    queryFn: () => getProject({ data: { slug } }),
  });
