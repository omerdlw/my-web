import { useDatabase } from "@/contexts/database-context";
import Icon from "@/components/icon";

export default function PostAction() {
  const { post } = useDatabase();

  console.log(post);

  return (
    <div className="h-auto rounded-[20px] mt-2.5 w-full flex items-center p-4 gap-3 bg-black/5 dark:bg-white/5">
      <div className="flex-1 h-auto flex flex-col justify-center space-y-1.5">
        <div className="flex items-center gap-2">
          <Icon icon={"solar:widget-2-bold"} />
          <span className="font-semibold text-base">{post.CATEGORY}</span>
        </div>
        <span className="opacity-75 text-sm italic">
          {Array.isArray(post.TAGS)
            ? post.TAGS.map((tag) => `#${tag.trim()}`).join(", ")
            : typeof post.TAGS === "string"
            ? post.TAGS.split(",")
                .map((tag) => `#${tag.trim()}`)
                .join(", ")
            : ""}
        </span>
      </div>
    </div>
  );
}
