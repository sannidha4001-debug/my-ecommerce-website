"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

/** Branded toast notifications that follow the active theme. */
export function AppToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      theme={(resolvedTheme as "light" | "dark") ?? "dark"}
      position="top-center"
      closeButton
      richColors={false}
      toastOptions={{
        duration: 4200,
        classNames: {
          toast:
            "!glass-strong !rounded-xl !border !border-border !text-foreground !shadow-glow",
          title: "!font-display !font-semibold !text-foreground",
          description: "!text-muted-foreground",
          actionButton: "!bg-brand-gradient !text-white",
          cancelButton: "!bg-secondary !text-secondary-foreground",
          closeButton: "!bg-secondary !text-foreground !border-border",
        },
      }}
    />
  );
}
