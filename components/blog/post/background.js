import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // cn fonksiyonunu import et

export default function Background({ background }) {
  const hasBackground = background && typeof background === "string";

  return (
    <>
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: hasBackground ? 1 : 0 }} // Resim yoksa opacity 0 yap
        transition={{ duration: 1.2, ease: "easeOut" }}
        className={cn(
          "fixed w-screen h-screen inset-0 -z-20 bg-cover bg-center bg-no-repeat", // z-index -20 yapıldı
          !hasBackground && "bg-white dark:bg-black", // Resim yoksa varsayılan arka plan
        )}
        style={hasBackground ? { backgroundImage: `url(${background})` } : {}}
      />
      <div className="fixed w-screen h-screen inset-0 -z-10 dark:bg-gradient-to-t dark:from-black dark:via-black/80 dark:to-black/60 bg-gradient-to-t from-white via-white/80 to-white/60"></div>{" "}
      {/* Opacity biraz ayarlandı */}
    </>
  );
}
