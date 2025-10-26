import { useRef, useState, useLayoutEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import classNames from "classnames"; // classnames import edildi

// Ok bileşeni ayrı bir component olarak tanımlandı
const ScrollButton = ({ direction, onClick, isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.button
        onClick={onClick}
        className={classNames(
          "absolute top-1/2 z-20 -translate-y-1/2 w-12 h-12 rounded-full cursor-pointer",
          "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg",
          "border border-black/10 dark:border-white/10",
          "flex items-center justify-center text-black dark:text-white",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          {
            "left-0 -translate-x-4": direction === "prev",
            "right-0 translate-x-4": direction === "next",
          },
        )}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.2 }}
        aria-label={`Scroll ${direction === "prev" ? "left" : "right"}`}
      >
        {direction === "prev" ? (
          <ChevronLeft size={24} />
        ) : (
          <ChevronRight size={24} />
        )}
      </motion.button>
    )}
  </AnimatePresence>
);

export function Carousel({
  itemClassName = "w-36 md:w-44",
  renderItem,
  items,
}) {
  if (!items || items.length === 0) return null;

  const scrollContainerRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    hasOverflow: false,
    isAtStart: true,
    isAtEnd: false,
  });

  const checkScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    const scrollWidth = el.scrollWidth;
    const clientWidth = el.clientWidth;

    const hasOverflow = scrollWidth > clientWidth;
    const isAtStart = scrollLeft < 50;
    // Küçük kaydırma farklılıklarını tolere etmek için küçük bir eşik değeri (örneğin 50) eklendi
    const isAtEnd = scrollWidth - (scrollLeft + clientWidth) < 50;

    setScrollState({ hasOverflow, isAtStart, isAtEnd });
  }, []); // Bağımlılık yok

  useLayoutEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScrollState(); // İlk durumu kontrol et

    const resizeObserver = new ResizeObserver(checkScrollState);
    resizeObserver.observe(el);

    // Event listener scroll için de eklenebilir ama onScroll prop'u yeterli
    el.addEventListener("scroll", checkScrollState, { passive: true });

    return () => {
      resizeObserver.disconnect();
      el.removeEventListener("scroll", checkScrollState);
    };
  }, [checkScrollState]); // checkScrollState useCallback ile sarmalandığı için dependency listesine eklendi

  const scroll = useCallback((direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8; // Yüzde 80 kaydırma
    el.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }, []); // Bağımlılık yok

  const { hasOverflow, isAtStart, isAtEnd } = scrollState;

  return (
    <div className="relative group">
      <div
        ref={scrollContainerRef}
        className="flex flex-nowrap overflow-x-auto gap-4 scrollbar-hide scroll-smooth py-1" // Biraz padding ekledik
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id || index} // Key olarak id varsa onu, yoksa index'i kullan
            className={classNames("shrink-0", itemClassName)} // clsx veya classnames kullanımı
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

      <ScrollButton
        direction="prev"
        onClick={() => scroll("prev")}
        isVisible={hasOverflow && !isAtStart}
      />
      <ScrollButton
        direction="next"
        onClick={() => scroll("next")}
        isVisible={hasOverflow && !isAtEnd}
      />
    </div>
  );
}
