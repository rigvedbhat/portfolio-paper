import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-[0.08em] uppercase transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-white/10 bg-white/5 text-zinc-100 backdrop-blur-sm hover:bg-white/10",
        secondary:
          "border-primary/20 bg-primary/10 text-primary hover:bg-primary/15",
        outline:
          "border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
