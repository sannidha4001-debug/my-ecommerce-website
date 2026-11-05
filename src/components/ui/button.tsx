import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Shared button styles. Most CTAs use the `default` (brand gradient) variant.
 * `asChild` lets us turn a <Link> into a button without nesting <a> tags.
 */
const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "btn-shine bg-brand-gradient text-white shadow-[0_12px_35px_-14px_rgba(99,102,241,0.9)] hover:brightness-110 hover:shadow-glow",
        secondary:
          "border border-white/10 bg-white/[0.06] text-foreground backdrop-blur-md hover:border-white/20 hover:bg-white/[0.1] dark:border-white/10",
        outline:
          "border border-border bg-transparent text-foreground hover:border-primary/50 hover:bg-primary/10",
        ghost:
          "text-foreground/80 hover:bg-secondary hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_12px_35px_-14px_rgba(244,63,94,0.8)] hover:brightness-110",
        link: "h-auto rounded-none p-0 text-primary underline-offset-4 hover:underline",
        glass:
          "glass text-foreground hover:border-primary/30 hover:bg-white/[0.08]",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-xl px-7 text-[15px]",
        icon: "h-10 w-10",
        "icon-sm": "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
