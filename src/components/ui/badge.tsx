import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-primary/25 bg-primary/15 text-primary",
        secondary: "border-border bg-secondary text-secondary-foreground",
        outline: "border-border text-muted-foreground",
        success:
          "border-emerald-400/25 bg-emerald-400/10 text-emerald-300 dark:text-emerald-300",
        warning:
          "border-amber-400/25 bg-amber-400/10 text-amber-300 dark:text-amber-300",
        danger: "border-rose-400/25 bg-rose-400/10 text-rose-300",
        live: "border-rose-400/30 bg-rose-500/15 text-rose-300",
        gradient:
          "border-transparent bg-brand-gradient text-white shadow-[0_4px_20px_-6px_rgba(139,92,246,0.7)]",
        glass: "glass border-white/10 text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
