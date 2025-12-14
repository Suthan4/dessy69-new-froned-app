import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>,"children"> {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
  ...props
}: BadgeProps) {
  const variants = {
    default:
      "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100",
    success: "badge-success",
    warning: "badge-warning",
    error: "badge-error",
    info: "bg-info/10 text-info",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span className={cn("badge", variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
