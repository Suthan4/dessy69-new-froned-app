"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 inline-flex rounded-full bg-error/10 p-6">
          <AlertCircle size={48} className="text-error" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="mb-6 text-neutral-600 dark:text-neutral-400">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
