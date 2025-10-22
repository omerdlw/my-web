import Icon from "@/components/icon";
import { cn } from "@/lib/utils";

const BASE_STYLES =
  "center cursor-pointer group rounded-3xl backdrop-blur-xl overflow-hidden bg-white/80 dark:bg-black/20 border border-black/10 dark:border-white/10 hover:border-skin-primary p-1 transition-colors duration-200 ease-linear";

const ICON_CONTAINER_BASE = "rounded-[18px] center bg-black/5 dark:bg-white/5";

const IconWrapper = ({ icon, color, className }) => {
  if (icon?.startsWith("http")) {
    return <img src={icon} alt="" className="w-[50px] h-full rounded-[18px]" />;
  }

  return (
    <div className={cn(ICON_CONTAINER_BASE, className)}>
      {icon && <Icon icon={icon} color={color} />}
    </div>
  );
};

export default function ControlsButton({
  description,
  className,
  onClick,
  color,
  text,
  icon,
  isActive,
  ...props
}) {
  const isIconOnly = icon && !text;

  const activeStyles = "bg-bg-skin-primary dark:bg-skin-secondary text-white";

  return (
    <button
      type="button"
      className={cn(
        BASE_STYLES,
        isIconOnly ? "size-[60px]" : "h-[60px]",
        className,
      )}
      onClick={onClick}
      aria-label={text || description}
      {...props}
    >
      {isIconOnly ? (
        <IconWrapper
          icon={icon}
          color={color}
          className={cn("w-full h-full", isActive && activeStyles)}
        />
      ) : (
        <>
          <IconWrapper
            className={cn(
              "w-[50px] h-full shrink-0 group-hover:bg-bg-skin-primary dark:group-hover:bg-skin-secondary group-hover:text-white transition-colors duration-200 ease-linear",
              isActive && activeStyles,
            )}
            icon={icon}
            color={color}
          />
          <div className="flex flex-col -space-y-0.5 px-3">
            <span className="truncate text-[15px]">{text}</span>
            {description && (
              <span className="text-sm truncate text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        </>
      )}
    </button>
  );
}
