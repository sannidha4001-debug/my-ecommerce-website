import { cn } from "@/lib/utils";

/** Animated placeholder used while data loads. */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-muted/70",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
