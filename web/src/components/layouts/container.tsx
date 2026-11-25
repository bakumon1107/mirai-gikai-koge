import type { ReactNode } from "react";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  const isArchiveLayout = siteConfig.homeLayout === "archive";

  return (
    <div
      className={cn(
        isArchiveLayout
          ? "mx-auto w-full px-4 pc:px-16"
          : "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}
