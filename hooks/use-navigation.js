import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { NAVIGATION_LINKS } from "../components/nav/constants";
import { useNavigationContext } from "@/contexts/navigation-context";

const SKELETON_ITEM = {
  name: "Yükleniyor...",
  href: "loading",
  icon: "...",
  description: "Lütfen bekleyin",
  skeleton: true,
};

export const useNavigation = () => {
  const { dynamicNavItem, expanded, setExpanded } = useNavigationContext();
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isBlogPostPage =
    pathname.startsWith("/blog/") && pathname.length > "/blog/".length;
  const showSkeleton = isBlogPostPage && !dynamicNavItem;

  useEffect(() => {
    if (!expanded) return;

    const handleClickOutside = (e) => {
      if (!document.getElementById("nav-card-stack")?.contains(e.target)) {
        setExpanded(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [expanded, setExpanded]);

  useEffect(() => {
    NAVIGATION_LINKS.forEach((link) => {
      try {
        router.prefetch?.(link.href);
      } catch {}
    });
  }, [router]);

  const navigationItems = useMemo(() => {
    const homeLink = NAVIGATION_LINKS.find((link) => link.href === "/");
    const blogLink = NAVIGATION_LINKS.find((link) => link.href === "/blog");
    const favoritesLink = NAVIGATION_LINKS.find(
      (link) => link.href === "/favorites"
    );

    if (showSkeleton) {
      return [SKELETON_ITEM, blogLink, favoritesLink, homeLink].filter(Boolean);
    }

    // Arşiv sayfası kontrolü eklendi
    if (
      !dynamicNavItem ||
      pathname === "/blog" ||
      pathname.startsWith("/archive")
    ) {
      if (pathname.startsWith("/archive")) {
        const archiveItem = {
          name: "Archive",
          href: "/archive",
          icon: "solar:archive-bold",
          description: "my watched list",
        };
        return [archiveItem, favoritesLink, blogLink, homeLink].filter(Boolean);
      }
      return NAVIGATION_LINKS;
    }

    return [dynamicNavItem, blogLink, favoritesLink, homeLink].filter(Boolean);
  }, [pathname, dynamicNavItem, showSkeleton]);

  const activeIndex = useMemo(() => {
    if (showSkeleton) return 0;
    // Arşiv sayfası için activeIndex düzeltmesi
    const currentPath = pathname.startsWith("/archive") ? "/archive" : pathname;
    const idx = navigationItems.findIndex((l) => l.href === currentPath);
    return idx >= 0 ? idx : 0;
  }, [pathname, navigationItems, showSkeleton]);

  const activeItem = navigationItems[activeIndex];
  const activeItemHasAction =
    activeItem?.href === "/" ||
    activeItem?.href.startsWith("/blog") ||
    activeItem?.href === "/favorites";

  const navigate = (href) => {
    router.push(href);
  };

  useEffect(() => {
    setExpanded(false);
  }, [pathname, setExpanded]);

  return {
    expanded,
    setExpanded,
    activeIndex,
    navigate,
    navigationItems:
      pathname === "/" || expanded || isHovered
        ? navigationItems
        : [activeItem],
    activeItemHasAction,
    pathname,
    showSkeleton,
    setIsHovered,
  };
};
