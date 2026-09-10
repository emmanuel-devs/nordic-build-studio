export type ProjectMetric = { value: string; label: string };

/** Metrics are stored as JSON on the project row; parse defensively. */
export function parseMetrics(input: unknown): ProjectMetric[] {
  if (!Array.isArray(input)) return [];
  return input.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const { value, label } = entry as Record<string, unknown>;
    if (typeof value !== "string" || typeof label !== "string") return [];
    return [{ value, label }];
  });
}
