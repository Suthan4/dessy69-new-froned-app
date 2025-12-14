import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && (
        <div className="mb-4 rounded-full bg-neutral-100 p-6 dark:bg-neutral-800">
          <Icon size={48} className="text-neutral-400" />
        </div>
      )}
      <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      {description && (
        <p className="mb-6 max-w-md text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
