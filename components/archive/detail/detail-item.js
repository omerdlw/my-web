export function DetailItem({ icon: IconComponent, label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div className="py-1">
      <div className="flex items-center gap-2 text-xs opacity-75 mb-0.5 uppercase tracking-wider font-medium">
        {IconComponent && <IconComponent size={14} className="opacity-70" />}{" "}
        <span>{label}</span>
      </div>
      <span className="text-sm font-medium text-black dark:text-white break-words">
        {value}
      </span>
    </div>
  );
}
