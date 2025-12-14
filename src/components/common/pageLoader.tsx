"use client";

import { Spinner } from "../ui/skeleton";


interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = "Loading..." }: PageLoaderProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <Spinner size={48} />
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">{message}</p>
      </div>
    </div>
  );
}
