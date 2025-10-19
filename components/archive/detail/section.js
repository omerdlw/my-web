import { motion } from "framer-motion";

export function Section({
  title,
  icon: IconComponent,
  children,
  className = "",
}) {
  return (
    <motion.section
      className={`mb-16 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-black dark:text-white border-l-4 border-red-500 pl-4 py-1 bg-gradient-to-r from-red-500/5 to-transparent">
        {IconComponent && <IconComponent size={24} className="opacity-80" />}
        {title}
      </h2>
      {children}
    </motion.section>
  );
}
