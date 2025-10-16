export const NAVIGATION_LINKS = [
  { name: "home", href: "/", icon: "solar:home-angle-2-bold", description: "about me & stuff" },
  { name: "blog", href: "/blog", icon: "solar:documents-minimalistic-bold", description: "my posts" },
  { name: "favorites", href: "/favorites", icon: "solar:medal-star-bold", description: "my favorite things" },
];

export const ANIMATION_CONFIG = {
  expanded: {
    offsetY: -85,
    scale: 1,
  },
  collapsed: {
    offsetY: -10,
    scale: 0.9,
  },
  transition: {
    stiffness: 150,
    mass: 0.8,
    damping: 20,
    restDelta: 0.1,
  },
};
