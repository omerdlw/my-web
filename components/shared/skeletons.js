"use client";

import { cn } from "@/lib/utils";

export function ArchiveGridSkeleton({ count = 10, className }) {
  return (
    <div className={cn("p-10", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-full h-[550px] rounded-primary animate-pulse",
              "bg-black/10 dark:bg-white/10",
            )}
            style={{
              animationDelay: `${i * 50}ms`,
              animationFillMode: "backwards",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function ArchiveDetailSkeleton({ className }) {
  return (
    <div className={cn("min-h-screen bg-white dark:bg-black", className)}>
      {/* Hero Background Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-black/10 dark:bg-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/40 dark:from-black dark:via-black/95 dark:to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-transparent dark:from-black/80 dark:via-transparent dark:to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-black dark:to-transparent" />
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Poster & Details */}
          <div className="lg:col-span-4">
            <div className="space-y-6">
              {/* Poster */}
              <div className="w-full aspect-[2/3] rounded-primary bg-black/10 dark:bg-white/10 animate-pulse border border-black/10 dark:border-white/10 shadow-2xl" />

              {/* Details Card */}
              <div className="p-6 rounded-primary bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-4 animate-pulse">
                <div className="h-8 w-full bg-black/10 dark:bg-white/10 rounded-full" />
                <div className="space-y-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-5 w-24 bg-black/10 dark:bg-white/10 rounded-full" />
                      <div className="h-5 w-32 bg-black/10 dark:bg-white/10 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-12 mt-8 w-full bg-black/10 dark:bg-white/10 rounded-full" />
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Title & Meta */}
            <div className="space-y-4 animate-pulse">
              <div className="h-10 w-3/4 bg-black/10 dark:bg-white/10 rounded-primary" />
              <div className="h-10 w-1/2 bg-black/10 dark:bg-white/10 rounded-primary" />
              <div className="flex flex-wrap gap-3 mt-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-20 bg-black/10 dark:bg-white/10 rounded-full"
                  />
                ))}
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-3 animate-pulse">
              <div className="h-5 w-24 bg-black/10 dark:bg-white/10 rounded-full" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-black/10 dark:bg-white/10 rounded-full"
                    style={{
                      width: i === 3 ? "75%" : "100%",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Cast */}
            <div className="space-y-4 animate-pulse">
              <div className="h-6 w-28 bg-black/10 dark:bg-white/10 rounded-full" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="aspect-[2/3] rounded-primary bg-black/10 dark:bg-white/10" />
                    <div className="h-3 w-full bg-black/10 dark:bg-white/10 rounded-full" />
                    <div className="h-2 w-3/4 bg-black/10 dark:bg-white/10 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Content */}
            <div className="space-y-4 animate-pulse">
              <div className="h-6 w-40 bg-black/10 dark:bg-white/10 rounded-full" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[2/3] rounded-primary bg-black/10 dark:bg-white/10"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20" />
    </div>
  );
}

export function FavoritesSkeleton({ className }) {
  return (
    <div
      className={cn("w-screen h-screen overflow-hidden relative", className)}
    >
      <div className="w-full h-[calc(100vh-7rem)] absolute top-0 left-0 right-0 bottom-0">
        <div className="w-full h-full flex items-center justify-center space-x-4 px-10">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="relative h-[80vh] flex-1 max-w-[550px] rounded-primary overflow-hidden animate-pulse border border-black/10 dark:border-white/10 shadow-lg"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "backwards",
              }}
            >
              <div className="absolute inset-0">
                <div className="w-full h-full bg-black/10 dark:bg-white/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-100" />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                {/* Title at top center */}
                <div className="absolute top-12 left-2/4 -translate-x-2/4 w-full px-4">
                  <div className="h-12 w-3/4 mx-auto bg-white/20 rounded-primary" />
                </div>

                {/* Content at bottom */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="h-9 w-20 bg-yellow-500/20 rounded-full backdrop-blur-sm border border-yellow-500/30" />
                    <div className="h-9 w-24 bg-white/10 rounded-full backdrop-blur-sm border border-white/20" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-white/10 rounded-full" />
                    <div className="h-4 w-11/12 bg-white/10 rounded-full" />
                    <div className="h-4 w-9/12 bg-white/10 rounded-full" />
                  </div>
                  <div className="h-14 w-full bg-white/20 rounded-secondary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BlogListSkeleton({ count = 10, className }) {
  return (
    <div className={cn("max-w-4xl mx-auto py-8 px-4 space-y-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center justify-between p-6 rounded-primary animate-pulse",
            "bg-white/5 dark:bg-black/20",
            "border border-black/10 dark:border-white/10",
          )}
          style={{
            animationDelay: `${i * 50}ms`,
            animationFillMode: "backwards",
          }}
        >
          <div className="flex-1">
            <div
              className="h-6 bg-black/10 dark:bg-white/10 rounded"
              style={{ width: `${Math.random() * 30 + 50}%` }}
            />
          </div>
          <div className="pl-4">
            <div className="h-4 w-24 bg-black/10 dark:bg-white/10 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Blog Post Skeleton
export function BlogPostSkeleton({ className }) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="fixed inset-0 bg-gradient-to-b from-black/20 to-transparent -z-10" />
      <article className="flex flex-col max-w-5xl py-20 mx-auto px-8 space-y-10">
        <div className="space-y-4">
          <div className="h-12 bg-black/10 dark:bg-white/10 rounded-primary w-3/4 mx-auto" />
          <div className="h-12 bg-black/10 dark:bg-white/10 rounded-primary w-2/3 mx-auto" />
        </div>
        <div className="space-y-4 pt-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-6 bg-black/10 dark:bg-white/10 rounded-primary"
              style={{
                width: i % 4 === 0 ? "85%" : i % 3 === 0 ? "92%" : "95%",
              }}
            />
          ))}
        </div>
        <div className="space-y-4 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-6 bg-black/10 dark:bg-white/10 rounded-primary"
              style={{
                width: i % 3 === 0 ? "88%" : i % 2 === 0 ? "90%" : "94%",
              }}
            />
          ))}
        </div>
      </article>
      <section className="max-w-4xl mx-auto flex flex-col space-y-6 px-8">
        <div className="h-8 w-40 bg-black/10 dark:bg-white/10 rounded-primary mx-auto" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-6 border border-black/10 dark:border-white/10 rounded-primary space-y-3"
          >
            <div className="h-5 w-40 bg-black/10 dark:bg-white/10 rounded-primary" />
            <div className="h-4 w-full bg-black/10 dark:bg-white/10 rounded-primary" />
            <div className="h-4 w-5/6 bg-black/10 dark:bg-white/10 rounded-primary" />
          </div>
        ))}
      </section>
      <div className="h-32" />
    </div>
  );
}

// Nav Card Skeleton
export function NavCardSkeleton({ className }) {
  return (
    <div
      className={cn(
        "w-[300px] absolute left-1/2 -translate-x-1/2 h-auto cursor-pointer rounded-primary bg-white/80 dark:bg-black/20 border border-black/10 dark:border-white/10 p-3 backdrop-blur-lg",
        className,
      )}
    >
      <div className="flex items-center h-auto gap-3 animate-pulse">
        <div className="w-[52px] h-[52px] rounded-primary bg-black/10 dark:bg-white/10" />
        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
          <div className="h-4 bg-black/10 dark:bg-white/10 rounded-full w-3/4" />
          <div className="h-3 bg-black/10 dark:bg-white/10 rounded-full w-1/2 mt-1" />
        </div>
      </div>
    </div>
  );
}
