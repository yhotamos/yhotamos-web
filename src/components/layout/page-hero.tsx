import { cn } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  description: string;
  className?: string;
};

export function PageHero({ title, description, className }: PageHeroProps) {
  return (
    <section className={cn("text-center space-y-4", className)}>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-secondary-foreground/70 text-sm md:text-base">{description}</p>
    </section>
  );
}
