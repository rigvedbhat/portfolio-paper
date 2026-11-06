import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl space-y-4",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
        {eyebrow}
      </p>
      <h2 className="text-4xl font-semibold tracking-[-0.04em] text-zinc-50 sm:text-5xl">
        {title}
      </h2>
      <p className="text-base leading-7 text-zinc-400 sm:text-lg">{description}</p>
    </div>
  );
}
