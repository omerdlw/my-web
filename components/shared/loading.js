"use client";

import Icon from "@/components/icon";
import { cn } from "@/lib/utils";

export default function Loading({
  icon = "mingcute:loading-3-fill",
  fullScreen = false,
  size = 40,
  className,
  text,
}) {
  const containerClasses = cn(
    "flex flex-col items-center justify-center gap-4",
    fullScreen && "h-screen w-screen fixed inset-0 z-50",
    !fullScreen && "p-4",
    className,
  );

  return (
    <div className={containerClasses} role="status" aria-label="Loading">
      <div className="animate-spin">
        <Icon className="text-skin-primary" icon={icon} size={size} />
      </div>
      {text && (
        <p className="text-sm text-skin-primary animate-pulse">{text}</p>
      )}
    </div>
  );
}

export function LoadingSpinner({ size = 20, className }) {
  return (
    <div
      className={cn("animate-spin inline-block", className)}
      aria-label="Loading"
      role="status"
    >
      <Icon icon="mingcute:loading-3-fill" size={size} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function LoadingSkeleton({ className, count = 1 }) {
  return (
    <div className={cn("gap-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-4 animate-pulse rounded"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
}

export function LoadingCard({ className }) {
  return (
    <div className={cn("p-6 border rounded-2xl gap-4", className)}>
      <div className="h-6 animate-pulse rounded w-3/4" />
      <div className="gap-2">
        <div className="h-4 animate-pulse rounded" />
        <div className="h-4 animate-pulse rounded w-5/6" />
        <div className="h-4 animate-pulse rounded w-4/6" />
      </div>
    </div>
  );
}
