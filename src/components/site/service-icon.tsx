import { Building2, Compass, HardHat, Hammer, Layers, Ruler, Wrench } from "lucide-react";

const icons = {
  compass: Compass,
  "hard-hat": HardHat,
  wrench: Wrench,
  ruler: Ruler,
  layers: Layers,
  building: Building2,
  hammer: Hammer,
} as const;

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons] ?? Hammer;
  return <Icon className={className} aria-hidden="true" />;
}
