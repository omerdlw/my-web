import classNames from "classnames";

export default function Comment({ comment, index, isFirst, isLast }) {
  return (
    <div
      className={classNames(
        "p-4 bg-white/60 dark:bg-black/20 last:rounded-b-3xl backdrop-blur-lg border border-black/10 dark:border-white/10 flex items-start space-x-4",
        {
          "rounded-t-3xl border-b-0": isFirst,
          "border-b-0": !isFirst && !isLast,
          "rounded-b-3xl": isLast,
        }
      )}
    >
      {comment.avatar && (
        <img
          src={comment.avatar}
          alt={`${comment.author}'s avatar`}
          className="w-10 h-10 rounded-full object-cover"
        />
      )}
      <div className="flex-1">
        <div className="flex items-baseline space-x-1">
          <p className="font-semibold text-lg">{comment.author}</p>
          <p className="text-xs opacity-75">•</p>
          <p className="text-xs opacity-75">
            {new Date(comment.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <p className="opacity-75">{comment.content}</p>
      </div>
    </div>
  );
}
