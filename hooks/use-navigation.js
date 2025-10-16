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
  const isArchiveDetailPage =
    pathname.startsWith("/archive/") && pathname.split("/").length > 3;

  const showSkeleton =
    (isBlogPostPage || isArchiveDetailPage) && !dynamicNavItem;

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
    // --- YENİ EKLENEN KART ---
    const archiveLink = {
      name: "Archive",
      href: "/archive",
      icon: "solar:archive-bold",
      description: "my watched list",
    };
    // -------------------------

    if (showSkeleton) {
      return [SKELETON_ITEM, favoritesLink, blogLink, homeLink].filter(Boolean);
    }

    if (dynamicNavItem) {
      // Blog detay sayfasındaysa
      if (isBlogPostPage) {
        return [dynamicNavItem, blogLink, favoritesLink, homeLink].filter(
          Boolean
        );
      }
      // --- DEĞİŞİKLİK BURADA ---
      // Arşiv detay sayfasındaysa, listeye "Archive" kartını ekle
      if (isArchiveDetailPage) {
        return [
          dynamicNavItem,
          archiveLink,
          favoritesLink,
          blogLink,
          homeLink,
        ].filter(Boolean);
      }
      // -------------------------
    }

    if (pathname === "/archive") {
      return [archiveLink, favoritesLink, blogLink, homeLink].filter(Boolean);
    }

    return NAVIGATION_LINKS;
  }, [
    pathname,
    dynamicNavItem,
    showSkeleton,
    isBlogPostPage,
    isArchiveDetailPage,
  ]);

  const activeIndex = useMemo(() => {
    if (showSkeleton) return 0;

    if (isBlogPostPage || isArchiveDetailPage) {
      return 0;
    }

    const currentPath = pathname.startsWith("/archive") ? "/archive" : pathname;
    const idx = navigationItems.findIndex((l) => l.href === currentPath);
    return idx >= 0 ? idx : 0;
  }, [
    pathname,
    navigationItems,
    showSkeleton,
    isBlogPostPage,
    isArchiveDetailPage,
  ]);

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
