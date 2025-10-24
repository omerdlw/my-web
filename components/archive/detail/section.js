import { motion } from "framer-motion";
import classNames from "classnames";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function Section({
  title,
  icon: IconComponent,
  children,
  className = "",
  titleClassName = "", // Başlık için ekstra class ekleme imkanı
  contentClassName = "", // İçerik için ekstra class ekleme imkanı
}) {
  return (
    <motion.section
      className={classNames("mb-12 md:mb-16", className)} // Alt boşluk ayarlandı, classNames kullanıldı
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // amount biraz düşürüldü
      variants={sectionVariants}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Başlık alanı */}
      <div
        className={classNames(
          "mb-6 flex items-center gap-3", // Genel başlık düzeni
          "border-l-4 border-red-500 pl-4 py-1", // Vurgu çizgisi ve padding
          // "bg-gradient-to-r from-red-500/5 to-transparent", // Gradient kaldırıldı, isteğe bağlı
          titleClassName, // Ekstra başlık stilleri
        )}
      >
        {IconComponent && (
          <IconComponent size={24} className="opacity-80 shrink-0" />
        )}{" "}
        {/* shrink-0 eklendi */}
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          {title}
        </h2>
      </div>

      {/* İçerik alanı */}
      <div className={contentClassName}>{children}</div>
    </motion.section>
  );
}
