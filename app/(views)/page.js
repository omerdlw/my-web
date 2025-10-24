"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/contexts/settings-context";

/**
 * Home Page Component
 * Main landing page of the application
 */
export default function HomePage() {
  const { theme } = useSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8 text-center">
        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-skin-base animate-fade-in">
            Hello, my name is <span className="text-skin-primary">Ömer</span>
          </h1>

          <p className="text-xl md:text-2xl text-skin-muted animate-fade-in-delay-1">
            Welcome to my personal space on the web
          </p>
        </div>

        {/* Description */}
        <div className="max-w-2xl mx-auto space-y-4 animate-fade-in-delay-2">
          <p className="text-lg text-skin-muted leading-relaxed">
            I'm a developer passionate about creating beautiful and functional
            web experiences. This is my corner of the internet where I share my
            thoughts, projects, and favorite things.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-8 animate-fade-in-delay-3">
          <a
            href="/blog"
            className="px-8 py-3 bg-skin-primary text-white rounded-xl font-medium hover:opacity-90 active:scale-95 transition-all duration-200"
          >
            Read My Blog
          </a>
          <a
            href="/favorites"
            className="px-8 py-3 border border-skin-base rounded-xl font-medium hover:bg-skin-muted active:scale-95 transition-all duration-200"
          >
            View Favorites
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-fade-in-delay-1 {
          opacity: 0;
          animation: fade-in 0.6s ease-out 0.2s forwards;
        }

        .animate-fade-in-delay-2 {
          opacity: 0;
          animation: fade-in 0.6s ease-out 0.4s forwards;
        }

        .animate-fade-in-delay-3 {
          opacity: 0;
          animation: fade-in 0.6s ease-out 0.6s forwards;
        }
      `}</style>
    </main>
  );
}
