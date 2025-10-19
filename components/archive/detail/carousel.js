import { useRef, useState, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Carousel({
  title,
  items,
  renderItem,
  itemClassName = "w-36 md:w-44",
}) {
  if (!items || items.length === 0) return null;

  const scrollContainerRef = useRef(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const checkScrollState = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const overflow = el.scrollWidth > el.clientWidth;
    setHasOverflow(overflow);
    const atStart = el.scrollLeft < 50;
    setIsAtStart(atStart);
    const atEnd = el.scrollWidth - (el.scrollLeft + el.clientWidth) < 50;
    setIsAtEnd(atEnd);
  };

  useLayoutEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScrollState();
    const resizeObserver = new ResizeObserver(checkScrollState);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [items]);

  const scroll = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group">
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollState}
        className="flex flex-nowrap overflow-x-auto space-x-4 scrollbar-hide scroll-smooth"
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id || index}
            className={`shrink-0 ${itemClassName}`}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: 0.4,
              delay: index * 0.05,
              ease: "easeOut",
            }}
          >
            {renderItem(item)}
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {hasOverflow && !isAtStart && (
          <motion.button
            onClick={() => scroll("prev")}
            className="absolute top-1/2 left-0 z-20 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full cursor-pointer bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg border border-black/10 dark:border-white/10 flex items-center justify-center text-black dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {hasOverflow && !isAtEnd && (
          <motion.button
            onClick={() => scroll("next")}
            className="absolute top-1/2 right-0 z-20 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full cursor-pointer bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg border border-black/10 dark:border-white/10 flex items-center justify-center text-black dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
