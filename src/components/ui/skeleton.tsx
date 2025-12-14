
interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({
  className,
  variant = "rectangular",
}: SkeletonProps) {
  const variants = {
    text: "h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={cn(
        "shimmer animate-pulse",
        variants[variant],
        variant === "text" && "my-2",
        className
      )}
    />
  );
}

// src/components/ui/Spinner.tsx
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 24, className }: SpinnerProps) {
  return (
    <Loader2
      size={size}
      className={cn("animate-spin text-primary-500", className)}
    />
  );
}
