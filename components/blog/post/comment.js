import classNames from "classnames";
import Icon from "@/components/icon"; // Varsayılan avatar için Icon import edildi

const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Invalid date format:", dateString);
    return "";
  }
};

export default function Comment({ comment, isFirst, isLast }) {
  if (!comment) return null;

  const { author = "Anonim", content = "", avatar, createdAt } = comment;
  const formattedDate = formatDate(createdAt);

  return (
    <div
      className={classNames(
        "p-4 flex items-start space-x-4",
        "bg-white/60 dark:bg-black/20 backdrop-blur-lg",
        "border border-black/10 dark:border-white/10 border-b-0",
        {
          "rounded-t-3xl": isFirst,
          "rounded-b-3xl": isLast,
          "!border-b": isLast,
        },
      )}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={`${author} avatarı`}
          className="w-10 h-10 rounded-full object-cover shrink-0"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
          <Icon icon="solar:user-bold" size={20} className="opacity-50" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-1.5 mb-1">
          <p className="font-semibold text-base break-words">{author}</p>{" "}
          {formattedDate && (
            <>
              <span className="text-xs opacity-60">•</span>
              <p className="text-xs opacity-60 whitespace-nowrap">
                {formattedDate}
              </p>
            </>
          )}
        </div>
        <p className="opacity-80 text-sm break-words">{content}</p>{" "}
      </div>
    </div>
  );
}
