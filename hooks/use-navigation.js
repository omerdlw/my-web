import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import { NAVIGATION_LINKS } from "../components/nav/constants";
import { useNavigationContext } from "@/contexts/navigation-context";
import { createNavItem } from "./use-nav-item";

const SKELETON_ITEM = createNavItem("skeleton");
const ARCHIVE_ITEM = createNavItem("archive");

const baseLinks = NAVIGATION_LINKS.reduce((acc, link) => {
  acc[link.name] = link;
  return acc;
}, {});

export const useNavigation = () => {
  const { dynamicNavItem, expanded, setExpanded } = useNavigationContext();
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isBlogPostPage =
    pathname.startsWith("/blog/") && pathname.length > "/blog/".length;
  const isArchiveDetailPage =
    pathname.startsWith("/archive/") &&
    pathname.split("/").length > 2 &&
    pathname.split("/")[2] !== "";
  const isArchivePage = pathname === "/archive";

  const showSkeleton =
    (isBlogPostPage || isArchiveDetailPage) && !dynamicNavItem;

  const handleNavigate = useCallback(
    (href) => {
      router.push(href);
      setExpanded(false);
    },
    [router, setExpanded],
  );

  useEffect(() => {
    if (!expanded) return;
    const handleClickOutside = (event) => {
      if (!document.getElementById("nav-card-stack")?.contains(event.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [expanded, setExpanded]);

  useEffect(() => {
    NAVIGATION_LINKS.forEach((link) => router.prefetch(link.href));
  }, [router]);

  useEffect(() => {
    setExpanded(false);
  }, [pathname, setExpanded]);

  const navigationItems = useMemo(() => {
    const { home, blog, favorites } = baseLinks;

    if (showSkeleton) {
      return [SKELETON_ITEM, favorites, blog, home].filter(Boolean);
    }

    if (dynamicNavItem) {
      if (isBlogPostPage) {
        return [dynamicNavItem, blog, favorites, home].filter(Boolean);
      }
      if (isArchiveDetailPage) {
        return [dynamicNavItem, ARCHIVE_ITEM, favorites, blog, home].filter(
          Boolean,
        );
      }
    }

    if (isArchivePage) {
      return [ARCHIVE_ITEM, favorites, blog, home].filter(Boolean);
    }

    return NAVIGATION_LINKS;
  }, [
    dynamicNavItem,
    showSkeleton,
    isBlogPostPage,
    isArchiveDetailPage,
    isArchivePage,
  ]);

  const activeIndex = useMemo(() => {
    if (showSkeleton || isBlogPostPage || isArchiveDetailPage) return 0;

    const currentPath = isArchivePage ? "/archive" : pathname;
    const index = navigationItems.findIndex(
      (item) => item.href === currentPath,
    );
    return Math.max(0, index);
  }, [
    pathname,
    navigationItems,
    showSkeleton,
    isBlogPostPage,
    isArchiveDetailPage,
    isArchivePage,
  ]);

  const activeItem = navigationItems[activeIndex];

  const displayItems = useMemo(() => {
    if (pathname === "/" || expanded || isHovered) {
      return navigationItems;
    }
    return activeItem ? [activeItem] : [];
  }, [pathname, expanded, isHovered, navigationItems, activeItem]);

  const activeItemHasAction = useMemo(
    () =>
      ["/", "/blog", "/favorites", "/archive"].includes(activeItem?.href) ||
      activeItem?.href?.startsWith("/blog/"),
    [activeItem],
  );

  return {
    expanded,
    setExpanded,
    activeIndex,
    navigate: handleNavigate,
    navigationItems: displayItems,
    activeItemHasAction,
    pathname,
    showSkeleton,
    setIsHovered,
  };
};
