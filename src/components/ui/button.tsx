"use client";

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type MotionButtonProps = HTMLMotionProps<"button"> &
  ButtonHTMLAttributes<HTMLButtonElement>;

interface ButtonProps extends MotionButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      fullWidth = false,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      outline: "btn-outline",
      ghost: "btn-ghost",
      danger: "btn bg-error text-white hover:bg-error/90",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    const iconSizes = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    const iconSpacing = {
      sm: leftIcon ? "pl-3" : rightIcon ? "pr-3" : "",
      md: leftIcon ? "pl-5" : rightIcon ? "pr-5" : "",
      lg: leftIcon ? "pl-7" : rightIcon ? "pr-7" : "",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
        className={cn(
          "btn relative",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          iconSpacing[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin"
            size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
          />
        )}

        <span
          className={cn(
            "flex items-center justify-center gap-2",
            loading && "invisible"
          )}
        >
          {leftIcon && (
            <span className={cn("inline-flex shrink-0", iconSizes[size])}>
              {leftIcon}
            </span>
          )}
          {children}
          {rightIcon && (
            <span className={cn("inline-flex shrink-0", iconSizes[size])}>
              {rightIcon}
            </span>
          )}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";
