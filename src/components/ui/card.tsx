import { ReactNode } from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type MotionDivProps = HTMLMotionProps<"div">;

interface CardProps extends MotionDivProps {
  children: ReactNode;
  hover?: boolean;
  className?: string;
}

export function Card({
  children,
  hover = false,
  className,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={hover ? { duration: 0.2 } : undefined}
      className={cn("card", hover && "card-hover", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
