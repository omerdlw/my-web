import { useRouter } from "next/navigation";
import Icon from "@/components/icon";

export function ErrorState() {
  const router = useRouter();
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center text-center text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-black px-4">
      <Icon
        icon="solar:sad-square-bold-duotone"
        className="mb-4 text-skin-error"
        size={60}
      />
      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
        Details Could Not Be Loaded
      </h2>
      <p>
        The requested content was not found or there might be an issue with the
        API keys.
      </p>
      <button
        onClick={() => router.back()}
        className="mt-6 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 text-black dark:text-white px-4 py-2 rounded-lg transition"
      >
        Go Back
      </button>
    </div>
  );
}
